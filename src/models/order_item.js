'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order_Item extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Order_Item.init(
        {
            id_shoes: DataTypes.INTEGER,
            id_order: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            fixed_price: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Order_Item',
        },
    );
    return Order_Item;
};
