const accountRoute = require('./user.routes.js');

const route = (app) => {
    app.use('/api/user', accountRoute);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    app.use('/', (req, res, next) => {
        return res.send('WELCOME TO SERVER');
    });
};

module.exports = route;
