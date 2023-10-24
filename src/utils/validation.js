const { validationResult, ValidationChain } = require('express-validator');

const validate = (validation) => {
    try {
        return async (req, res, next) => {
            const result = await validation.run(req);
            const errors = validationResult(req);

            const errorsObject = errors.mapped();
            if (errors.isEmpty()) {
                return next();
            }
            console.log(errorsObject);
            for (const key in errorsObject) {
                errorsObject[key].message = errorsObject[key].msg;
                delete errorsObject[key].msg;
            }
            return next(errorsObject);
        };
    } catch (error) {
        return next(error);
    }
};
module.exports = validate;
