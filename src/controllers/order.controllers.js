const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const { uploadImage, handleFormData } = require('../utils/fileHandle');
const shoesServices = require('../services/shoes.services');
const cartServices = require('../services/cart.services');
const orderServices = require('../services/order.services');

class OrderController {
    async createOrderWithCartItem(req, res, next) {
        // cartItems: [ { id_shoes, quantity, id_cartItem, price }]
        const { cartItems } = req.body;
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await orderServices.createOrderWithCartItem(cartItems, userID);
        res.json(result);
    }
    async createOneItemOrder(req, res, next) {
        // Item: { id_shoes, quantity,  price }
        const { Item } = req.body;
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await orderServices.createOneItemOrder(Item, userID);
        res.json(result);
    }
    async OrderDetails(req, res, next) {
        const { id_order } = req.params;
        const result = await orderServices.OrderDetails(id_order);
        res.json(result);
    }
    async HistoryOrder(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await orderServices.HistoryOrder(userID);
        res.json(result);
    }
    async StatusOrder(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const { id_status } = req.params;
        const result = await orderServices.StatusOrder(userID, id_status);
        res.json(result);
    }
    async CancelOrder(req, res, next) {
        const { id_order } = req.params;
        const result = await orderServices.CancelOrder(id_order);
        res.json(result);
    }
    async UpdateStatusOrder(req, res, next) {
        const { id_order } = req.params;
        const result = await orderServices.UpdateStatusOrder(id_order);
        res.json(result);
    }
}
module.exports = new OrderController();
