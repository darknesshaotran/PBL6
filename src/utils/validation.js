const { validationResult, ValidationChain } = require('express-validator');
const ErrorsWithStatus = require('../constants/Error');

const validate = (validation) => {
    try {
        return async (req, res, next) => {
            const result = await validation.run(req);
            const errors = validationResult(req);
            const errorsObject = errors.mapped();
            if (errors.isEmpty()) {
                return next();
            }
            for (const key in errorsObject) {
                errorsObject[key].message = errorsObject[key].msg;
                delete errorsObject[key].msg;
                if (errorsObject[key].message.status) {
                    const err = new ErrorsWithStatus({
                        status: errorsObject[key].message.status,
                        message: errorsObject[key].message.message,
                    });
                    return next(err);
                }
            }
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: errorsObject,
            });
        };
    } catch (error) {
        return next(error);
    }
};
module.exports = validate;
