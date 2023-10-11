'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('inforUsers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            id_account: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Accounts', // Tên bảng mà khoá ngoại liên kết đến
                    key: 'id', // Tên trường khoá chính trong bảng Role
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            lastname: {
                type: Sequelize.STRING,
            },
            firstname: {
                type: Sequelize.STRING,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            avatar: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('inforUsers');
    },
};
