const ErrorsWithStatus = require('../constants/Error');
const userServices = require('../services/user.services');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
class AccountController {
    async register(req, res, next) {
        const data = req.body;
        const result = await userServices.register(data);
        return res.json(result);
    }
    async login(req, res, next) {
        const { user } = req;
        const result = await userServices.login(user.id, user.id_role);
        return res.json(result);
    }
    async logout(req, res, next) {
        const { refreshToken } = req.body;
        const result = await userServices.logout(refreshToken);
        return res.json(result);
    }
    async refreshToken(req, res, next) {
        const { decoded_refresh_token } = req;
        const { refreshToken } = req.body;
        const { userID, exp, role } = decoded_refresh_token;
        const result = await userServices.refreshToken(userID, exp, refreshToken, role);
        return res.json(result);
    }
    //  submit email and send forgot_password_token to reset password
    async forgotPassword(req, res, next) {
        const { user } = req;
        const result = await userServices.forgotPassword(user.id, user.email);
        res.json(result);
    }
    //  verify token link in email to reset password
    async verifyForgotPassword(req, res, next) {
        res.json({
            success: true,
            message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS,
        });
    }
    //  reset password
    async resetPassword(req, res, next) {
        const { decoded_forgot_password_token } = req;
        const userID = decoded_forgot_password_token.userID;
        const { password } = req.body;
        const result = await userServices.resetPassword(userID, password);
        res.json(result);
    }

    async getMyprofile(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await userServices.getMyprofile(userID);
        res.json(result);
    }
}
module.exports = new AccountController();
