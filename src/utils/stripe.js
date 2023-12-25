const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const checkout_session = async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items,
            mode: 'payment',
            success_url: process.env.SUCCESS_PAYMENT_LINK,
            cancel_url: process.env.FAILED_PAYMENT_LINK,
            payment_method_types: ['card'],
            // payment_intent_data: {
            //     amount: req.body.amount,
            //     currency: 'usd',
            // },
        });

        res.json({ success: true, message: 'payment session created', sessionId: session.id, url: session.url });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = checkout_session;
