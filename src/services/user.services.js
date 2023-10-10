const db = require('../models');
const { ErrorsWithStatus } = require('../constants/Error');
const Account = require('../models/account');

class UserServices {
    async register(data) {
        return data;
    }
}
module.exports = new UserServices();
