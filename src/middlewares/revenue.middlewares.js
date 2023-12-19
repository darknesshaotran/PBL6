const { checkSchema } = require('express-validator');
const validate = require('../utils/validation');
const USERS_MESSAGES = require('../constants/messages');
const HTTP_STATUS = require('../constants/httpStatus');

const checkTimeValidator = checkSchema(
    {
        startDate: {
            notEmpty: {
                errorMessage: 'startDate is required',
            },
            custom: {
                options: (value, { req }) => {
                    const dateFormat =
                        /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
                    if (!dateFormat.test(value)) {
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'Invalid date format. Use yyyy/mm/dd hh/mm/ss ( example: 2023-11-01 08:31:28 )',
                        };
                    }
                    return true;
                },
            },
        },
        endDate: {
            notEmpty: {
                errorMessage: 'endDate is required',
            },
            custom: {
                options: (value, { req }) => {
                    const dateFormat =
                        /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
                    if (!dateFormat.test(value)) {
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'Invalid date format. Use yyyy/mm/dd hh/mm/ss ( example: 2023-11-01 08:31:28 )',
                        };
                    }
                    return true;
                },
            },
        },
    },
    ['query'],
);
exports.TimeValidator = validate(checkTimeValidator);
