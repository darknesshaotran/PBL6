'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Message.belongsTo(models.Account, { foreignKey: 'id_reciever', targetKey: 'id' });
            Message.belongsTo(models.Account, { foreignKey: 'id_sender', targetKey: 'id' });
        }
    }
    Message.init(
        {
            id_reciever: DataTypes.INTEGER,
            id_sender: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Message',
        },
    );
    return Message;
};
