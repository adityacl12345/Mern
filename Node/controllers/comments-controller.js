const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const Comment = require('../models/comment');
const User = require('../models/user');

const getCommentsByPlaceId = async (req, res, next) => {
    const { pid } = req.params;
    let placeComments;
    try {
        placeComments = await Comment.find({placeId: pid});
    } catch(err) {
        return next(new HttpError('Something went wrong!', 500))
    }
    if(!placeComments) {
        return next(new HttpError('Could not Find a place with this user Id!', 404));
    }
    res.json({comments: placeComments.map(comment => comment.toObject({getters: true}))});
};

const createComment = async (req, res, next) => {
    const { placeId, userId, text } = req.body;

    let user, userName, userImg;
    try {
        user = await User.findById(userId);
        userName = user.name;
        userImg = user.image;
    } catch(err) {
        return next(err);
    }

    const createdComment = new Comment({
        placeId,
        userId,
        userName,
        userImg,
        text
    });    
    try {
        if(createdComment) {
            console.log(createdComment);
            await createdComment.save();
        }
    } catch(err) {
        const error = new HttpError('Failed to post comment!', 500);
        return next(error);
    }

    res.status(201).json({comment: createdComment});
};

// const deletePlace = async (req, res, next) => {
//     const placeId = req.params.pid;

//     // For dummy array
//     /* if(!places.find(p => p.id === placeId)) {
//         throw new HttpError('Could not find place with Id.', 404);
//     }
//     places = places.filter(p => p.id !== placeId); */
//     //----------------

//     let place;
//     try {
//         place = await Place.findById(placeId).populate('creatorId');
//     } catch(err) {
//         const Error = new HttpError('Something went wrong! Could not find place by ID', 500);
//         return next(Error);
//     }

//     if(!place) {
//         return next(new HttpError('Could not find place with Id!', 404));
//     }

//     if(place.creatorId.id !== req.userData.userId) {
//         return next(new HttpError('You are not allowed to change this!', 401));
//     }

//     try {
//         const sess = await mongoose.startSession();
//         sess.startTransaction();
//         await place.deleteOne({ session: sess });
//         place.creatorId.places.pull(place);
//         await place.creatorId.save({ session: sess });
//         await sess.commitTransaction();
//     } catch(err) {
//         const Error = new HttpError('Something went wrong! Could not delete Place', 500);
//         console.log(err);
//         return next(Error);
//     }

//     res.status(200).json({ "message": "PLace Deleted" });
// };

exports.getCommentsByPlaceId = getCommentsByPlaceId;
exports.createComment = createComment;

//exports.deletePlace = deletePlace;