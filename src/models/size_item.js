'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Size_Item extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Size_Item.belongsTo(models.Shoes, { foreignKey: 'id_shoes', targetKey: 'id' });
            Size_Item.belongsTo(models.Shoes, { foreignKey: 'id_shoes', targetKey: 'id', as: 'Shoes' });
        }
    }
    Size_Item.init(
        {
            size: DataTypes.INTEGER,
            id_shoes: DataTypes.INTEGER,
            amount: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Size_Item',
        },
    );
    return Size_Item;
};
