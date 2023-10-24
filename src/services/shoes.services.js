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
        const shoes = await db.Shoes.findAll({
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
        const Shoes = JSON.parse(JSON.stringify(shoes));

        for (let i = 0; i < Shoes.length; i++) {
            const rating = await db.Rating.findAll({
                where: { id_shoes: Shoes[i].id },
            });
            const Rating = JSON.parse(JSON.stringify(rating));
            var totalStar = 0;
            for (let i = 0; i < Rating.length; i++) {
                totalStar += Number(Rating[i].star);
            }
            totalStar = Math.floor(totalStar / Rating.length);
            Shoes[i].totalStar = totalStar ? totalStar : 0;
        }
        const totalPages = Math.ceil(Count / limit);
        return {
            success: true,
            result: Shoes,
            totalPages: totalPages,
            page: page ? page : 1,
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
        var totalStar = 0;
        for (let i = 0; i < Rating.length; i++) {
            totalStar += Number(Rating[i].star);
        }
        totalStar = Math.floor(totalStar / Rating.length);
        const shoesDetails = {
            ...Shoes,
            image: Image,
            rating: Rating,
            totalStar: totalStar,
        };

        return { success: true, result: shoesDetails };
    }
    async addShoes(id_category, id_brand, name, price, import_price, amount, description, color, size, image) {
        const shoes = await db.Shoes.create({
            id_category,
            id_brand,
            name,
            price,
            import_price,
            amount,
            description,
            color,
            size,
        });
        for (let i = 0; i < image.length; i++) {
            await db.Image.create({
                image: image[i].url,
                id_shoes: shoes.id,
            });
        }
        return {
            success: true,
            message: 'add shoes successfully',
        };
    }
}
module.exports = new ShoesServices();
