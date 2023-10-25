const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const { uploadImage, handleFormData } = require('../utils/fileHandle');
const shoesServices = require('../services/shoes.services');
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
    async updateQuantityItem(req, res, next) {}
    async deleteCartItem(req, res, next) {}
}
module.exports = new ShoesController();
