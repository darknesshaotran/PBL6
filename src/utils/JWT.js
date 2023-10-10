const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const signAccessToken = (payload) => {
    const options = { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN };
    return new Promise()((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
            if (err) throw reject(err);
            resolve(token);
        });
    });
};

const signReFreshToken = (payload) => {
    const options = { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN };
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
            if (err) throw reject(err);
            resolve(token);
        });
    });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) throw reject(new ErrorsWithStatus({ message: err.message, status: HTTP_STATUS.UNAUTHORIZED }));
            resolve(decoded);
        });
    });
};

exports.signAccessToken = signAccessToken;
exports.signReFreshToken = signReFreshToken;
exports.verifyToken = verifyToken;
