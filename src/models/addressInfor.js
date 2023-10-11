'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class addressInfor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    addressInfor.init(
        {
            id_account: DataTypes.INTEGER,
            address: DataTypes.DATE,
            phoneNumber: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'addressInfor',
        },
    );
    return addressInfor;
};
