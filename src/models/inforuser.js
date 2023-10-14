'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class inforUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            inforUser.belongsTo(models.Account, { foreignKey: 'id_account', targetKey: 'id' });
        }
    }
    inforUser.init(
        {
            id_account: DataTypes.INTEGER,
            lastname: DataTypes.STRING,
            firstname: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            avatar: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'inforUser',
        },
    );
    return inforUser;
};
