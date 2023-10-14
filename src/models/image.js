'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Image.belongsTo(models.Shoes, { foreignKey: 'id_shoes', targetKey: 'id' });
        }
    }
    Image.init(
        {
            image: DataTypes.STRING,
            id_shoes: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Image',
        },
    );
    return Image;
};
