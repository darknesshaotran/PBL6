const db = require('../models');
const { ErrorsWithStatus } = require('../constants/Error');
const Account = require('../models/account');
const hashPassword = require('../utils/crypto');
const USERS_MESSAGES = require('../constants/messages');
const { signAccessToken, signReFreshToken, verifyToken } = require('../utils/JWT');

class UserServices {
    async findUserLogin(email, password) {
        const user = await db.Account.findOne({ where: { email: email, password: hashPassword(password) } });
        if (user === null) {
            throw new Error(USERS_MESSAGES.WRONG_EMAIL_OR_PASSWORD);
        }
        return user;
    }
    async isEmailExist(email) {
        const user = await db.Account.findOne({ where: { email: email } });
        if (user === null) return false;
        else return true;
    }

    ////////// MAIN FUNCTION /////////////
    async register(data) {
        const user = await db.Account.create({ email: data.email, password: hashPassword(data.password) });
        const inforUser = await db.inforUser.create({
            id_account: user.id,
            lastname: data.lastname,
            firstname: data.firstname,
            phoneNumber: data.phoneNumber,
        });
        return {
            success: true,
            message: USERS_MESSAGES.REGISTER_SUCCESS,
        };
    }
    async login(userID) {
        const [accessToken, refreshToken] = await Promise.all([
            signAccessToken({ userID: userID }),
            signReFreshToken({ userID: userID }),
        ]);
        return {
            success: true,
            message: USERS_MESSAGES.LOGIN_SUCCESS,
            accessToken,
            refreshToken,
        };
    }
}
module.exports = new UserServices();
