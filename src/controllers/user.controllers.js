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
    async logout(req, res, next) {
        const { refreshToken } = req.body;
        const result = await userServices.logout(refreshToken);
        return res.json(result);
    }
    async refreshToken(req, res) {
        const { decoded_refresh_token } = req;
        const { refreshToken } = req.body;
        const { userID, exp } = decoded_refresh_token;
        const result = await userServices.refreshToken(userID, exp, refreshToken);
        return res.json(result);
    }
}
module.exports = new AccountController();
