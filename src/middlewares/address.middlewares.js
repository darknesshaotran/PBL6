const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorsWithStatus = require('../constants/Error');
const validate = require('../utils/validation');
const db = require('../models');
const USERS_MESSAGES = require('../constants/messages');

const checkAddressExistsValidator = checkSchema(
    {
        id_address: {
            custom: {
                options: async (value) => {
                    const address = await db.addressInfor.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!address) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'address not found' };
                    }
                    return true;
                },
            },
        },
    },
    ['params'],
);
const checkAddAddressValidator = checkSchema(
    {
        phoneNumber: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.PHONENUMBER_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.PHONENUMBER_MUST_BE_STRING,
            },
            isMobilePhone: {
                errorMessage: 'Phone number is invalid',
            },
        },
        address: {
            notEmpty: {
                errorMessage: 'address is required',
            },
        },
    },
    ['body'],
);
const checkUpdateAddressValidator = checkSchema(
    {
        phoneNumber: {
            optional: true,
            isString: {
                errorMessage: USERS_MESSAGES.PHONENUMBER_MUST_BE_STRING,
            },
            isMobilePhone: {
                errorMessage: 'Phone number is invalid',
            },
        },
        address: {
            optional: true,
        },
    },
    ['body'],
);
exports.AddressExistsValidator = validate(checkAddressExistsValidator);
exports.AddAddressValidator = validate(checkAddAddressValidator);
exports.UpdateAddressValidator = validate(checkUpdateAddressValidator);
