const addressServices = require('../services/address.services');
const AddressService = require('../services/address.services');
class AddressController {
    async getAddressList(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await AddressService.getAddressList(userID);
        res.json(result);
    }
    async deleteAddress(req, res, next) {
        const { id_address } = req.params;
        const result = await addressServices.deleteAddress(id_address);
        res.json(result);
    }
    async addAddress(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const { address, phoneNumber } = req.body;
        const result = await addressServices.addAddress(userID, address, phoneNumber);
        res.json(result);
    }
    async updateAddress(req, res, next) {
        const { id_address } = req.params;
        //  const { address, phoneNumber } = req.body;
        const result = await addressServices.updateAddress(id_address, req.body);
        res.json(result);
    }
}
module.exports = new AddressController();
