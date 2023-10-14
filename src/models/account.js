'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Account.belongsTo(models.Role, { foreignKey: 'id_role' });
            Account.hasOne(models.inforUser, { foreignKey: 'id_account' });
            Account.hasOne(models.Cart, { foreignKey: 'id_account' });
            Account.hasMany(models.Message, { foreignKey: 'id_reciever' });
            Account.hasMany(models.Message, { foreignKey: 'id_sender' });
            Account.hasMany(models.addressInfor, { foreignKey: 'id_account' });
            Account.hasMany(models.Order, { foreignKey: 'id_account' });
            Account.hasMany(models.Rating, { foreignKey: 'id_account' });
        }
    }
    Account.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            id_role: DataTypes.INTEGER,
            forgot_password_token: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Account',
        },
    );
    return Account;
};
