const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('b8za4wfy118lkrqptkvs', 'ulo9nfk4b2vfkaex', 'VtnVIzwARBNsFpgJr9sL', {
    host: 'b8za4wfy118lkrqptkvs-mysql.services.clever-cloud.com',
    dialect: 'mysql',
    logging: false,
});
const conenctionDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = conenctionDatabase;
