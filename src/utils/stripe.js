const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const checkout_session = async (req, res, next) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({ success: true, message: 'payment successful', paymentIntent: paymentIntent.client_secret });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
module.exports = checkout_session;
