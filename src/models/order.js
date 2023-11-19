'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.belongsTo(models.Account, { foreignKey: 'id_account', targetKey: 'id' });
            Order.belongsTo(models.Status, { foreignKey: 'id_status', targetKey: 'id' });
            Order.belongsToMany(models.Size_Item, {
                through: models.Order_Item,
                as: 'Order_items',
                foreignKey: 'id_order',
                otherKey: 'id_size_item',
            });
        }
    }
    Order.init(
        {
            id_account: DataTypes.INTEGER,
            createAt: DataTypes.DATE,
            id_status: DataTypes.INTEGER,
            order_address: DataTypes.STRING,
            order_phoneNumber: DataTypes.STRING,
            totalPrice: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Order',
        },
    );
    return Order;
};
