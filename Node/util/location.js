const axios = require('axios');
const HttpError = require('../models/http-error');
const API_KEY = 'AIzaSyA1sVf8oT7Ey7wCTRzmDxg0-xE3is8de-Y';

async function getCoordsForAddress(address) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);

    const data = response.data;

    if(!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError('The address is not valid', 422);
    }

    const coords = data.results[0].geometry.location;

    return coords;
}

module.exports = getCoordsForAddress;