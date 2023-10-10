const { Request, Response, NextFunction } = require('express');
const { validationResult, ValidationChain } = require('express-validator');
const { RunnableValidationChains } = require('express-validator/src/middlewares/schema');
const HTTP_STATUS = require('../constants/httpStatus');
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

            return next(errorsObject);
        };
    } catch (error) {
        return next(error);
    }
};
module.exports = validate;
