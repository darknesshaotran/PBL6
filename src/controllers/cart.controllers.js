const cartServices = require('../services/cart.services');

class ShoesController {
    async addToCart(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const { id_shoes, quantity } = req.body;
        const result = await cartServices.addToCart(userID, id_shoes, quantity);
        res.json(result);
    }
    async getCartDetails(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await cartServices.getCartDetails(userID);
        res.json(result);
    }
    async updateQuantityItem(req, res, next) {
        const { id_shoes } = req.params;
        const { quantity } = req.body;
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await cartServices.updateQuantityItem(userID, quantity, id_shoes);
        res.json(result);
    }
    async deleteCartItem(req, res, next) {
        const { id_cartItem } = req.params;
        const result = await cartServices.deleteQuantityItem(id_cartItem);
        res.json(result);
    }
}
module.exports = new ShoesController();
