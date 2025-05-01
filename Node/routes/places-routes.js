const express = require('express');
const { check } = require('express-validator');

const placesController = require('../controllers/places-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', placesController.getPlaces);

router.get('/search', placesController.searchPlaces);

router.get('/:pid', placesController.getPlaceById);

router.get('/user/:uid', placesController.getPlacesByUserId)

router.use(checkAuth);

router.post('/', fileUpload.array('images', 5), [ check('title').not().isEmpty(), check('desc').isLength({min: 5}), check('address').not().isEmpty() ], placesController.createPlace);

router.post('/:pid/like', placesController.ratePlace);

router.patch('/:pid', [ check('title').not().isEmpty(), check('desc').isLength({min: 5}) ], placesController.updatePlace);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;