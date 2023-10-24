const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const Account = require('../models/account');
const inforUser = require('../models/inforuser');
const hashPassword = require('../utils/crypto');
const USERS_MESSAGES = require('../constants/messages');
const { signAccessToken, signReFreshToken, verifyToken, signForgotPasswordToken } = require('../utils/JWT');
const HTTP_STATUS = require('../constants/httpStatus');

class ShoesServices {
    async getListShoes(minPrice, maxPrice, limit, page, category, brand, search, isDesc) {
        var offset = 0;
        var optionMaxPrice = {};
        var optionMinPrice = {};
        if (page && limit) {
            offset = (page - 1) * limit;
        }
        if (!limit) {
            limit = 100;
        }
        if (minPrice) {
            optionMinPrice = { price: { [Op.gte]: minPrice } };
        }
        if (maxPrice) {
            optionMaxPrice = { price: { [Op.lte]: maxPrice } };
        }
        const categoryCondition = category ? { id_category: category } : {};
        const brandCondition = brand ? { id_brand: brand } : {};
        const searchCondition = search ? { name: { [Op.like]: `%${search}%` } } : {};
        const options = {
            ...optionMinPrice,
            ...optionMaxPrice,
            ...brandCondition,
            ...categoryCondition,
            ...searchCondition,
        };
        console.log(options);
        const order = [['price', isDesc ? 'DESC' : 'ASC']];
        const Count = await db.Shoes.count({
            where: {
                ...options,
            },
        });
        const Shoes = await db.Shoes.findAll({
            where: {
                ...options,
            },
            offset: offset,
            limit: limit,
            order: order,
            attributes: {
                exclude: ['id_category', 'id_brand', 'createdAt', 'updatedAt'],
            },
            include: [
                { model: db.Brand, as: 'Brand', attributes: ['id', 'name'] },
                { model: db.Category, as: 'Category', attributes: ['id', 'name'] },
            ],
        });

        const totalPages = Math.ceil(Count / limit);
        return {
            success: true,
            result: Shoes,
            totalPages: totalPages,
            page: page,
        };
    }
    async shoesDetails(id_shoes) {
        const shoes = await db.Shoes.findOne({
            where: {
                id: id_shoes,
            },
            attributes: {
                exclude: ['id_category', 'id_brand', 'createdAt', 'updatedAt'],
            },
            include: [
                { model: db.Brand, as: 'Brand', attributes: ['id', 'name'] },
                { model: db.Category, as: 'Category', attributes: ['id', 'name'] },
            ],
        });
        const Shoes = JSON.parse(JSON.stringify(shoes));
        const image = await db.Image.findAll({
            where: { id_shoes: id_shoes },
            attributes: ['id', 'image'],
        });

        const Image = JSON.parse(JSON.stringify(image));
        const rating = await db.Rating.findAll({
            where: { id_shoes: id_shoes },
            attributes: { exclude: ['id_shoes'] },
            include: [
                {
                    model: db.Account,
                    as: 'Account',
                    attributes: { exclude: ['password', 'forgot_password_token', 'id_role', 'createdAt', 'updatedAt'] },
                    include: [
                        {
                            model: db.inforUser,
                            as: 'inforUser',
                            attributes: ['firstname', 'lastname', 'phoneNumber', 'avatar'],
                        },
                    ],
                },
            ],
        });
        const Rating = JSON.parse(JSON.stringify(rating));

        const shoesDetails = {
            ...Shoes,
            image: Image,
            rating: Rating,
        };

        return { success: true, result: shoesDetails };
    }
}
module.exports = new ShoesServices();
