const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Place = require('../models/place');
const User = require('../models/user');
const getCoordsForAddress = require('../util/location');

const getPlaces = async (req, res, next) => {
    let places;
    try {
        places = await Place.find();
    } catch(err) {
        const Error = new HttpError('Something went wrong!', 500);
        return next(Error);
    }
    if(!places) {
        return next(new HttpError('Could not Find a place with this place Id!', 404));
    }
    res.json({places: places.map(place => place.toObject({getters: true}))});
};

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch(err) {
        const Error = new HttpError('Something went wrong!', 500);
        return next(Error);
    }
    if(!place) {
        return next(new HttpError('Could not Find a place with this place Id!', 404));
    }
    res.json({place: place.toObject({getters: true})});
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userPlaces;
    try {
        userPlaces = await User.findById(userId).populate('places');
    } catch(err) {
        return next(new HttpError('Something went wrong!', 500))
    }
    if(!userPlaces || userPlaces.places.length === 0) {
        return next(new HttpError('Could not Find a place with this user Id!', 404));
    }
    res.json({places: userPlaces.places.map(place => place.toObject({getters: true}))});
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return next(new HttpError('The inputs are invalid, please check your data', 422));
    }
    const { title, desc, address} = req.body;
    let coords;
    try {
        coords = await getCoordsForAddress(address);
    } catch(err) {
        return next(err);
    }
    const imageUrls = req.files.map(file => `/uploads/images/${file.filename}`);
    const createdPlace = new Place({
        title,
        desc,
        address,
        location: coords,
        images: imageUrls,
        creatorId: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch {
        const error = new HttpError('Failed to create place!', 500);
        return next(error);
    }
    if(!user) {
        const error = new HttpError('No user found!', 500);
        return next(error); 
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch(err) {
        const error = new HttpError('Failed to create Place!', 500);
        return next(error);
    }

    res.status(201).json({placename: createdPlace});

    console.log(createdPlace);
};

const updatePlace = async (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return next(new HttpError('The inputs are invalid, please check your data', 422));
    }
    const { title, desc } = req.body;
    const placeId = req.params.pid;

    // For DUMMY place array
    /* const updatedPlace = { ...places.find(p => p.id === placeId) }
    const placeIndex = places.findIndex(p => p.id === placeId); */
    // ----------------------

    let place;
    try {
        place = await Place.findById(placeId);
    } catch(err) {
        const Error = new HttpError('Something went wrong! Could not find place by ID', 500);
        return next(Error);
    }

    if(place.creatorId.toString() !== req.userData.userId) {
        return next(new HttpError('You are not allowed to change this!', 401));
    }

    place.title = title;
    place.desc = desc;
    
    try {
        await place.save();
    } catch(err) {
        return next(new HttpError('Something went wrong, could not be saved!', 500));
    }

    res.status(200).json({ updatedPlace: place.toObject({getters: true})});
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    // For dummy array
    /* if(!places.find(p => p.id === placeId)) {
        throw new HttpError('Could not find place with Id.', 404);
    }
    places = places.filter(p => p.id !== placeId); */
    //----------------

    let place;
    try {
        place = await Place.findById(placeId).populate('creatorId');
    } catch(err) {
        const Error = new HttpError('Something went wrong! Could not find place by ID', 500);
        return next(Error);
    }

    if(!place) {
        return next(new HttpError('Could not find place with Id!', 404));
    }

    if(place.creatorId.id !== req.userData.userId) {
        return next(new HttpError('You are not allowed to change this!', 401));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creatorId.places.pull(place);
        await place.creatorId.save({ session: sess });
        await sess.commitTransaction();
    } catch(err) {
        const Error = new HttpError('Something went wrong! Could not delete Place', 500);
        console.log(err);
        return next(Error);
    }

    res.status(200).json({ "message": "PLace Deleted" });
};

const ratePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    const { userId, rating } = req.body;
  
    const place = await Place.findById(placeId);
  
    if (!place) {
      return res.status(404).json({ message: 'Place not found.' });
    }

    console.log(userId, rating);
  
    const existingRating = place.ratings.find(r => r.user.toString() === userId);
  
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      place.ratings.push({ user: userId, rating });
    }
  
    // Recalculate average rating
    place.averageRating =
      place.ratings.reduce((acc, cur) => acc + cur.rating, 0) / place.ratings.length;
  
    await place.save();
  
    res.status(200).json({ message: 'Rating updated!', averageRating: place.averageRating });
};
  
exports.getPlaces = getPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.ratePlace = ratePlace;