const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');

class AddressService {
    async getAddressList(userID) {
        const addresses = await db.addressInfor.findAll({
            where: { id_account: userID },
            attribute: { exclude: ['createdAt', 'updatedAt'] },
        });
        return {
            success: true,
            addresses: addresses,
        };
    }
    async deleteAddress(id_address) {
        await db.addressInfor.destroy({
            where: { id: id_address },
        });
        return {
            success: true,
            message: 'delete address successfully',
        };
    }
    async addAddress(userID, address, phoneNumber) {
        await db.addressInfor.create({
            id_account: userID,
            address: address,
            phoneNumber: phoneNumber,
        });
        return {
            success: true,
            message: 'add address successfully',
        };
    }
    async updateAddress(id_address, data) {
        await db.addressInfor.update(
            {
                ...data,
                updatedAt: new Date(),
            },
            {
                where: { id: id_address },
            },
        );
        return {
            success: true,
            message: 'update address successfully',
        };
    }
}
module.exports = new AddressService();
