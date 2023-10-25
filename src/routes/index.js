const accountRoute = require('./user.routes.js');
const shoesRoute = require('./shoes.routes.js');
const cartRoute = require('./cart.routes.js');
const route = (app) => {
    app.use('/api/user', accountRoute);
    app.use('/api/shoes', shoesRoute);
    app.use('/api/cart', cartRoute);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    app.use('/', (req, res, next) => {
        return res.send('WELCOME TO SERVER');
    });
};

module.exports = route;
