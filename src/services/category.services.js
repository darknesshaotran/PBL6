const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');

class CategoryServices {
    async getCategoryList() {
        const categories = await db.Category.findAll({
            attribute: { exclude: ['createdAt', 'updatedAt'] },
        });
        return {
            success: true,
            categories: categories,
        };
    }
    async deleteCategory(id_category) {
        await db.Category.destroy({
            where: { id: id_category },
        });
        return {
            success: true,
            message: 'delete category successfully',
        };
    }
    async addCategory(images, name) {
        await db.Category.create({
            name: name,
            image: images[0].url,
        });
        return {
            success: true,
            message: 'add category successfully',
        };
    }
}
module.exports = new CategoryServices();
