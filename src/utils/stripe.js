const dotenv = require('dotenv');
const orderServices = require('../services/order.services');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const checkout_session = async (req, res, next) => {
    try {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const { address, phoneNumber, size_items } = req.body;
        const order = await orderServices.createOnlinePaymentOrder(size_items, userID, address, phoneNumber);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items,

            // "items": [
            // {
            //     "price_data": {
            //         "currency": "usd",
            //         "product_data": {
            //             "name":"T-shirt"
            //         },
            //         "unit_amount": 69
            //     },
            //     "quantity": 2
            // },
            //]
            mode: 'payment',
            success_url: process.env.SUCCESS_PAYMENT_LINK,
            cancel_url: process.env.FAILED_PAYMENT_LINK + `?orderID=${order.id}`,
            payment_method_types: ['card'],
        });

        res.json({ success: true, message: 'payment session created', sessionId: session.id, url: session.url });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = checkout_session;
