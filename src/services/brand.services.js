const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');

class BrandServices {
    async getBrandList() {
        const brands = await db.Brand.findAll({
            attribute: { exclude: ['createdAt', 'updatedAt'] },
        });
        return {
            success: true,
            brands: brands,
        };
    }
    async deleteBrand(id_brand) {
        await db.Brand.destroy({
            where: { id: id_brand },
        });
        return {
            success: true,
            message: 'delete brand successfully',
        };
    }
    async addBrand(images, name) {
        await db.Brand.create({
            name: name,
            image: images[0].url,
        });
        return {
            success: true,
            message: 'add brand successfully',
        };
    }
}
module.exports = new BrandServices();
