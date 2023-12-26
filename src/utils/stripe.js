const dotenv = require('dotenv');
const orderServices = require('../services/order.services');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const checkout_session = async (req, res, next) => {
    try {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const { address, phoneNumber, size_items, cart_size_items, items } = req.body;
        if (address && phoneNumber && items) {
            if (size_items) {
                if (items.length > 0) {
                    const order = await orderServices.createOneItemOrder(size_items, userID, address, phoneNumber);
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: items,
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
                        cancel_url: process.env.FAILED_PAYMENT_LINK + `?orderID=${order.order.id}`,
                        payment_method_types: ['card'],
                    });
                    res.json({
                        success: true,
                        message: 'payment session created',
                        sessionId: session.id,
                        url: session.url,
                    });
                } else if (items.length <= 0) {
                    res.status(400).json({ error: 'items for stripe is null' });
                }
            } else if (cart_size_items) {
                if (cart_size_items.length > 0 && items.length > 0) {
                    const order = await orderServices.createOrderWithCartItem(
                        cart_size_items,
                        userID,
                        address,
                        phoneNumber,
                    );
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: items,
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
                        cancel_url: process.env.FAILED_PAYMENT_LINK + `?orderID=${order.order.id}`,
                        payment_method_types: ['card'],
                    });
                    res.json({
                        success: true,
                        message: 'payment session created',
                        sessionId: session.id,
                        url: session.url,
                    });
                } else if (items.length <= 0) {
                    res.status(400).json({ error: 'items for stripe is null' });
                } else if (cart_size_items.length <= 0) {
                    res.status(400).json({ error: ' cart size items for order is null' });
                }
            } else {
                res.status(400).json({ error: 'please fill cart items or single size item the information' });
            }
        } else {
            res.status(400).json({ error: 'please fill full the information (phoneNumber, address, stripe infor)' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = checkout_session;
