const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            throw new Error('Could not find Token, authentication failed');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch(err) {
        return next(new HttpError('Authentication failed', 401));
    }
    
}