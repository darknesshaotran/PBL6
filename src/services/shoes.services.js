const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
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
                exclude: ['id_category', 'id_brand', 'createdAt', 'updatedAt', 'description', 'color'],
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

            const image = await db.Image.findOne({
                where: { id_shoes: Shoes[i].id },
            });

            const Image = JSON.parse(JSON.stringify(image));
            Shoes[i].totalStar = totalStar ? totalStar : 0;
            Shoes[i].image = Image ? Image.image : '';
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
        const Size_Item = await db.Size_Item.findAll({
            where: { id_shoes: id_shoes },
            attributes: ['id', 'amount', 'size'],
        });
        const size_item = JSON.parse(JSON.stringify(Size_Item));
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
            order: [['id', 'DESC']],
        });
        const Rating = JSON.parse(JSON.stringify(rating));
        var totalStar = 0;
        for (let i = 0; i < Rating.length; i++) {
            totalStar += Number(Rating[i].star);
        }
        totalStar = Math.floor(totalStar / Rating.length);
        const shoesDetails = {
            ...Shoes,
            Size_items: size_item,
            image: Image,
            rating: Rating,
            totalStar: totalStar,
        };

        return { success: true, result: shoesDetails };
    }
    async addShoes(id_category, id_brand, name, price, import_price, description, color, image) {
        const shoes = await db.Shoes.create({
            id_category,
            id_brand,
            name,
            price,
            import_price,
            description,
            color,
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
    async deleteShoes(id_shoes) {
        await db.Shoes.destroy({
            where: {
                id: id_shoes,
            },
        });
        return {
            success: true,
            message: 'delete shoes successfully',
        };
    }
    async updateShoesInfor(id_shoes, data) {
        await db.Shoes.update(
            {
                ...data,
                updatedAt: new Date(),
            },
            {
                where: { id: id_shoes },
            },
        );
        return {
            success: true,
            message: 'update shoes successfully',
        };
    }
    async updateShoesImages(id_shoes, image) {
        await db.Image.destroy({
            where: {
                id_shoes: id_shoes,
            },
        });
        for (let i = 0; i < image.length; i++) {
            await db.Image.create({
                image: image[i].url,
                id_shoes: id_shoes,
            });
        }
        return {
            success: true,
            message: 'update images successfully',
        };
    }
    async addSizeItem(id_shoes, size, amount) {
        const size_item = await db.Size_Item.findOne({
            where: {
                id_shoes: id_shoes,
                size: size,
            },
        });
        if (size_item) {
            await db.Size_Item.update(
                {
                    amount: Number(size_item.amount) + Number(amount),
                },
                {
                    where: { id: size_item.id },
                },
            );
            return {
                success: true,
                message: 'update size item successfully',
            };
        }
        await db.Size_Item.create({
            id_shoes,
            size,
            amount,
        });
        return {
            success: true,
            message: 'add size item successfully',
        };
    }
}
module.exports = new ShoesServices();
