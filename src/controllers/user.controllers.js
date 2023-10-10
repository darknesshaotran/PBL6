const ErrorsWithStatus = require('../constants/Error');
const userServices = require('../services/user.services');
const UserServices = require('../services/user.services');
const HTTP_STATUS = require('../constants/httpStatus');
class AccountController {
    async register(req, res, next) {
        const data = req.body;
        return res.json({ success: true, data: data });
    }
}
module.exports = new AccountController();
