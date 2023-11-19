const orderServices = require('../services/order.services');

class OrderController {
    async createOrderWithCartItem(req, res, next) {
        // cartItems: [ { id_size_item, quantity, id_cartItem, price }]
        const { cartItems, address, phoneNumber } = req.body;
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await orderServices.createOrderWithCartItem(cartItems, userID, address, phoneNumber);
        res.json(result);
    }
    async createOneItemOrder(req, res, next) {
        // Item: { id_size_item, quantity,  price }
        const { Item, address, phoneNumber } = req.body;
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await orderServices.createOneItemOrder(Item, userID, address, phoneNumber);
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
    // ADMIN
    async UpdateStatusOrder(req, res, next) {
        const { id_order } = req.params;
        const result = await orderServices.UpdateStatusOrder(id_order);
        res.json(result);
    }
    async getAllStatusOrderList(req, res, next) {
        const { id_status } = req.params;
        const result = await orderServices.getAllStatusOrderList(id_status);
        res.json(result);
    }
}
module.exports = new OrderController();
