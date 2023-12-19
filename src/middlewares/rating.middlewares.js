const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorsWithStatus = require('../constants/Error');
const validate = require('../utils/validation');
const db = require('../models');

const checkRatingExistsValidator = checkSchema(
    {
        id_rating: {
            custom: {
                options: async (value) => {
                    const rating = await db.Rating.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!rating) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'rating not found' };
                    }
                    return true;
                },
            },
        },
    },
    ['params'],
);
const checkAddRatingValidator = checkSchema(
    {
        id_shoes: {
            custom: {
                options: async (value) => {
                    const shoes = await db.Shoes.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!shoes) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'shoes not found' };
                    }
                    return true;
                },
            },
        },
        star: {
            notEmpty: {
                errorMessage: 'star is required',
            },
            isNumeric: {
                errorMessage: 'star must be number',
            },
            custom: {
                options: async (value) => {
                    if (value < 1 || value > 5) {
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'star must be from 1 to 5',
                        };
                    }
                    return true;
                },
            },
        },
    },
    ['body'],
);
const checkUpdateRatingValidator = checkSchema(
    {
        star: {
            notEmpty: {
                errorMessage: 'star is required',
            },
            isNumeric: {
                errorMessage: 'star must be number',
            },
            custom: {
                options: async (value) => {
                    if (value < 1 || value > 5) {
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'star must be from 1 to 5',
                        };
                    }
                    return true;
                },
            },
        },
    },
    ['body'],
);

exports.RatingExistsValidator = validate(checkRatingExistsValidator);
exports.AddRatingValidator = validate(checkAddRatingValidator);
exports.UpdateRatingValidator = validate(checkUpdateRatingValidator);
