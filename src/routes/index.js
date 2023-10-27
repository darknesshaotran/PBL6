const accountRoute = require('./user.routes.js');
const shoesRoute = require('./shoes.routes.js');
const cartRoute = require('./cart.routes.js');
const orderRoute = require('./order.routes.js');
const brandRoute = require('./brand.routes.js');
const categoryRoute = require('./category.routes.js');
const ratingRoute = require('./rating.routes.js');
const addressRoute = require('./address.routes.js');
const route = (app) => {
    app.use('/api/user', accountRoute);
    app.use('/api/shoes', shoesRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/order', orderRoute);
    app.use('/api/brand', brandRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/rating', ratingRoute);
    app.use('/api/address', addressRoute);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    app.use('/', (req, res, next) => {
        return res.send('WELCOME TO SERVER');
    });
};

module.exports = route;
