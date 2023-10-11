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
        const decodeRefreshToken = await verifyToken(refreshToken);
        const user = await db.refreshToken.create({ refreshToken: refreshToken, exp: decodeRefreshToken.exp });
        return {
            success: true,
            message: USERS_MESSAGES.LOGIN_SUCCESS,
            accessToken,
            refreshToken,
        };
    }
    async logout(refreshToken) {
        await db.refreshToken.destroy({
            where: {
                refreshToken: refreshToken,
            },
        });
        return { success: true, message: USERS_MESSAGES.LOGOUT_SUCCESS };
    }

    async refreshToken(userID, exp, refreshToken) {
        const [new_access_token, new_refresh_token] = await Promise.all([
            signAccessToken({ userID: userID }),
            signReFreshToken({ userID: userID, exp: exp }),
            db.refreshToken.destroy({ where: { refreshToken: refreshToken } }),
        ]);
        await db.refreshToken.create({ refreshToken: new_refresh_token, exp: exp });

        return {
            success: true,
            message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
            AccessToken: new_access_token,
            refreshToken: new_refresh_token,
        };
    }
}
module.exports = new UserServices();
