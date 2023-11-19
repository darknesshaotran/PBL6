'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Carts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            id_shoes: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Shoes', // Tên bảng mà khoá ngoại liên kết đến
                    key: 'id', // Tên trường khoá chính trong bảng Role
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            id: {
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
        await queryInterface.dropTable('Carts');
    },
};
