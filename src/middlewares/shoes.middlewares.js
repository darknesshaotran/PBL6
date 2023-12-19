const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorsWithStatus = require('../constants/Error');
const validate = require('../utils/validation');
const db = require('../models');
const { wrapController } = require('../utils/handle');
const checkAddShoesValidator = async (req, res, next) => {
    const { urls, Fields } = req.formdata;

    const { id_category, id_brand, name, price, import_price, amount, description, color, size } = Fields;
    if (!id_category) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'category is required',
        };
    }
    if (!id_brand) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'brand is required',
        };
    }

    const category = await db.Category.findOne({ where: { id: id_category } });
    const brand = await db.Brand.findOne({ where: { id: id_brand } });

    if (!category) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'category not found',
        };
    }

    if (!brand) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'brand not found',
        };
    }
    if (!name) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'name is required',
        };
    }
    if (isNaN(price)) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'price must be a number',
        };
    }
    if (isNaN(import_price)) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'import price must be a number',
        };
    }
    if (!color) {
        throw {
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'name is required',
        };
    }

    next();
};
const checkShoesExistsValidator = checkSchema(
    {
        id_shoes: {
            custom: {
                options: async (value) => {
                    const shoes = await db.Shoes.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['id_category', 'id_brand', 'createdAt', 'updatedAt'],
                        },
                    });
                    if (!shoes) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'shoes not found' };
                    }
                    return true;
                },
            },
        },
    },
    ['params'],
);
const checkUpdateShoesInfor = checkSchema(
    {
        id_category: {
            optional: true,
            isNumeric: {
                errorMessage: 'category id must be a number',
            },
            custom: {
                options: async (value) => {
                    const category = await db.Category.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!category) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'category not found' };
                    }
                    return true;
                },
            },
        },
        id_brand: {
            optional: true,
            isNumeric: {
                errorMessage: 'brand id must be a number',
            },
            custom: {
                options: async (value) => {
                    const brand = await db.Brand.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!brand) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'brand not found' };
                    }
                    return true;
                },
            },
        },
        name: {
            optional: true,
            isString: {
                errorMessage: 'name must be a string',
            },
            isLength: {
                options: {
                    max: 50,
                    min: 1,
                },
                errorMessage: 'name must be between 1 and 50 chars long',
            },
            trim: true,
        },
        price: {
            optional: true,
            isNumeric: {
                errorMessage: 'price must be a number',
            },
        },
        import_price: {
            optional: true,
            isNumeric: {
                errorMessage: 'import price must be a number',
            },
        },
        amount: {
            optional: true,
            isNumeric: {
                errorMessage: 'amount must be a number',
            },
        },
        color: {
            optional: true,
            isString: {
                errorMessage: 'color must be a string',
            },
            trim: true,
        },
        size: {
            optional: true,
            isNumeric: {
                errorMessage: 'size must be a number',
            },
        },
    },
    ['body'],
);

exports.AddShoesValidator = wrapController(checkAddShoesValidator);
exports.ShoesExistsValidator = validate(checkShoesExistsValidator);
exports.UpdateShoesInfor = validate(checkUpdateShoesInfor);
