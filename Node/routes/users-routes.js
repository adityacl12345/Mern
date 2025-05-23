const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById);

router.post('/signup', fileUpload.single('image'), [ check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 8}), check('bio').not().isEmpty()], usersController.signUp);

router.post('/login', usersController.logIn);

router.patch('/:uid', fileUpload.single('image'), [ check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('bio').not().isEmpty() ], usersController.editProfile);

module.exports = router;