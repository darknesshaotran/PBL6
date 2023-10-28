const { ErrorsWithStatus } = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorHandler = (err, req, res, next) => {
    console.log('error', err);
    try {
        if (err.name === 'ErrorsWithStatus') {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        return res.status(HTTP_STATUS.INTERAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
            error: err,
        });
    } catch (error) {
        return res.status(HTTP_STATUS.INTERAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
};
module.exports = ErrorHandler;
