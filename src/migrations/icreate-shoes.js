'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Shoes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            id_category: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categories', // Tên bảng mà khoá ngoại liên kết đến
                    key: 'id', // Tên trường khoá chính trong bảng Role
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            id_brand: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Brands', // Tên bảng mà khoá ngoại liên kết đến
                    key: 'id', // Tên trường khoá chính trong bảng Role
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            import_price: {
                type: Sequelize.INTEGER,
            },
            amount: {
                type: Sequelize.INTEGER,
            },
            description: {
                type: Sequelize.STRING,
            },
            color: {
                type: Sequelize.STRING,
            },
            size: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Shoes');
    },
};
