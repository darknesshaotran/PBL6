const ErrorsWithStatus = require('../constants/Error');
const userServices = require('../services/user.services');
const UserServices = require('../services/user.services');
const HTTP_STATUS = require('../constants/httpStatus');
class AccountController {
    async register(req, res, next) {
        // throw new ErrorsWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'loi with status' });
        return res.json({ success: true });
    }
}
module.exports = new AccountController();
