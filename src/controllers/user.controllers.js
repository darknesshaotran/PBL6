const ErrorsWithStatus = require('../constants/Error');
const userServices = require('../services/user.services');
const HTTP_STATUS = require('../constants/httpStatus');
class AccountController {
    async register(req, res, next) {
        const data = req.body;
        const result = await userServices.register(data);
        return res.json(result);
    }
    async login(req, res, next) {
        const { user } = req;
        const result = await userServices.login(user.id);
        return res.json(result);
    }
}
module.exports = new AccountController();
