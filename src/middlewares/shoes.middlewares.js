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
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'category is required',
        });
    }
    if (!id_brand) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'brand is required',
        });
    }

    const category = await db.Category.findOne({ where: { id: id_category } });
    const brand = await db.Brand.findOne({ where: { id: id_brand } });

    if (!category) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'category not found',
        });
    }

    if (!brand) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'brand not found',
        });
    }
    if (!name) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'name is required',
        });
    }
    if (isNaN(price)) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'price must be a number',
        });
    }
    if (isNaN(import_price)) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'import price must be a number',
        });
    }
    if (isNaN(amount)) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'amount must be a number',
        });
    }
    if (!color) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'name is required',
        });
    }
    if (isNaN(size)) {
        throw new ErrorsWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: 'size must be a number',
        });
    }

    next();
};

exports.AddShoesValidator = wrapController(checkAddShoesValidator);
