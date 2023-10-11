const db = require('../models');
const { ErrorsWithStatus } = require('../constants/Error');
const Account = require('../models/account');
const hashPassword = require('../utils/crypto');
const USERS_MESSAGES = require('../constants/messages');
const { signAccessToken, signReFreshToken, verifyToken, signForgotPasswordToken } = require('../utils/JWT');

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
        const user = await db.Account.create({ id_role: 2, email: data.email, password: hashPassword(data.password) });
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

    async forgotPassword(userID, email) {
        const forgot_password_token = await signForgotPasswordToken({ userID: userID, type: 'forgotPasswordToken' });
        await db.Account.update(
            {
                forgot_password_token: forgot_password_token,
            },
            { where: { id: userID } },
        );
        ///// đoạn code send email ở đây (làm sau)
        ////ở đây console log tạm thời
        console.log('forgot_password_token: ', forgot_password_token);
        return {
            success: true,
            message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
        };
    }

    async resetPassword(userID, password) {
        await db.Account.update(
            {
                forgot_password_token: '',
                password: hashPassword(password),
                updatedAt: new Date(),
            },
            { where: { id: userID } },
        );
        return {
            success: true,
            message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS,
        };
    }
}
module.exports = new UserServices();
