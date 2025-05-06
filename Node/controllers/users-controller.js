const uuid = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async(req, res, next) => {
    let Users;
    try {
      Users = await User.find({}, '-password');
    } catch {
      return next(new HttpError('Something went wrong, could not get users!', 500));
    }
    res.json({ Users: Users.map(user => user.toObject({getters: true})) });
}

const getUserById = async(req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
      user = await User.findById(userId);
    } catch(err) {
      return next(new HttpError('Something went wrong with fetching user!', 500))
    }
    if(!user) {
      return next(new HttpError('Could not find a user with this user Id!', 404));
    }
    res.json({user: user.toObject({getters: true})});
};
const signUp = async (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return next(new HttpError('The inputs are invalid, please check your data', 422));
    }
    const { name, email, password, image, bio } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch(err) {
      return next(new HttpError('Sign up Failed!', 500));
    }

    if(existingUser) {
      return next(new HttpError('User already exists!', 422));
    }

    let hashedPass;
    try {
      hashedPass = await bcrypt.hash(password, 12);
    } catch(err) {
      return next(new HttpError('Failed to signup, something went wrong', 500))
    }

    const createdUser = new User({
      name,
      email,
      password: hashedPass,
      image: req.file.path,
      bio,
      places: []
    });

    try {
      await createdUser.save();
    } catch {
      return next(new HttpError('Could not create user!', 500));
    }

    let token;
    try{
      token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_KEY, {expiresIn: '1h'});
    } catch(err) {
      return next(new HttpError('Could not create user!', 500));
    }
    

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};
const logIn = async(req, res, next) => {
    const { email, password } = req.body;

    let identifiedUser;
    try {
      identifiedUser = await User.findOne({ email: email });
    } catch(err) {
      return next(new HttpError('Could not find user!', 500))
    }

    if(!identifiedUser) {
      return next(new HttpError('Invalid email or password!', 401));
    }

    let isValidPass = false;
    try {
      isValidPass = await bcrypt.compare(password, identifiedUser.password);
    } catch(err) {
      return next(new HttpError('Could not log in!'))
    }

    if(!isValidPass) {
      return next(new HttpError('Invalid email or password!', 401));
    }

    let token;
    try{
      token = jwt.sign({userId: identifiedUser.id, email: identifiedUser.email}, process.env.JWT_KEY, {expiresIn: '1h'});
    } catch(err) {
      return next(new HttpError('Could not create user!', 500));
    }

    res.json({ userId: identifiedUser.id, email: identifiedUser.email, token: token }).status(201);
};

const editProfile = async(req, res, next) => {
  const error = validationResult(req);

    if(!error.isEmpty()) {
        return next(new HttpError('The inputs are invalid, please check your data', 422));
    }
    const { name, email, bio } = req.body;
    const uid = req.params.uid;

    // For DUMMY place array
    /* const updatedPlace = { ...places.find(p => p.id === placeId) }
    const placeIndex = places.findIndex(p => p.id === placeId); */
    // ----------------------

    let user;
    try {
        user = await User.findById(uid);
    } catch(err) {
        const Error = new HttpError('Something went wrong! Could not find user by ID', 500);
        return next(Error);
    }

    user.name = name;
    user.email = email;
    user.bio = bio;
    if (req.file) 
      user.image = req.file.path;
    
    try {
        await user.save();
    } catch(err) {
        return next(new HttpError('Something went wrong, could not be saved!', 500));
    }

    res.status(200).json({ updatedUser: user.toObject({getters: true})});
};


exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.logIn = logIn;
exports.signUp = signUp;
exports.editProfile = editProfile;