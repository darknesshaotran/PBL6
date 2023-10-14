'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Shoes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Shoes.belongsTo(models.Category, { foreignKey: 'id_category', targetKey: 'id' });
            Shoes.belongsTo(models.Brand, { foreignKey: 'id_brand', targetKey: 'id' });
            Shoes.hasMany(models.Rating, { foreignKey: 'id_shoes' });
        }
    }
    Shoes.init(
        {
            id_category: DataTypes.INTEGER,
            id_brand: DataTypes.INTEGER,
            name: DataTypes.STRING,
            price: DataTypes.INTEGER,
            import_price: DataTypes.INTEGER,
            amount: DataTypes.INTEGER,
            description: DataTypes.STRING,
            color: DataTypes.STRING,
            size: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Shoes',
        },
    );
    return Shoes;
};
