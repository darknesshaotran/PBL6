const accountRoute = require('./user.routes.js');
const shoesRoute = require('./shoes.routes.js');
const cartRoute = require('./cart.routes.js');
const orderRoute = require('./order.routes.js');
const brandRoute = require('./brand.routes.js');
const categoryRoute = require('./category.routes.js');
const ratingRoute = require('./rating.routes.js');
const addressRoute = require('./address.routes.js');
const revenueRoute = require('./revenue.routes.js');
const messageRoute = require('./message.routes.js');
const paymentRoute = require('./payment.routes.js');
const orderServices = require('../services/order.services.js');
const { wrapController } = require('../utils/handle.js');
const route = (app) => {
    app.use('/api/payment', paymentRoute);
    app.use('/api/user', accountRoute);
    app.use('/api/shoes', shoesRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/order', orderRoute);
    app.use('/api/brand', brandRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/rating', ratingRoute);
    app.use('/api/address', addressRoute);
    app.use('/api/revenue', revenueRoute);
    app.use('/api/message', messageRoute);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    app.use('/success', (req, res, next) => {
        return res.send('PAYMENT SUCCESSFUL !!!');
    });

    app.use(
        '/fail',
        wrapController(async (req, res, next) => {
            const { orderID } = req.query;
            console.log(orderID);
            await orderServices.deleteOrder(orderID);
            return res.send('PAYMENT FAILED !!!');
        }),
    );

    app.use('/', (req, res, next) => {
        return res.send('WELCOME TO SERVER');
    });
};

module.exports = route;
