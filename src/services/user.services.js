const db = require('../models');
const ErrorsWithStatus = require('../constants/Error');
const hashPassword = require('../utils/crypto');
const USERS_MESSAGES = require('../constants/messages');
const { signAccessToken, signReFreshToken, verifyToken, signForgotPasswordToken } = require('../utils/JWT');
const HTTP_STATUS = require('../constants/httpStatus');
const sendEmail = require('../utils/Email');
const dotenv = require('dotenv');
dotenv.config();
class UserServices {
    async findUserLogin(email, password) {
        const user = await db.Account.findOne({ where: { email: email, password: hashPassword(password) } });
        if (user === null) {
            return false;
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
        await db.Cart.create({
            id_account: user.id,
        });
        await sendEmail('<h1 style="color:red">😍 register successfully 😍</h1>', 'PBL6_message', data.email);
        return {
            success: true,
            message: USERS_MESSAGES.REGISTER_SUCCESS,
        };
    }
    async login(userID, id_role) {
        const role = id_role === 1 ? 'admin' : 'customer';
        const [accessToken, refreshToken] = await Promise.all([
            signAccessToken({ userID: userID, role: role }),
            signReFreshToken({ userID: userID, role: role }),
        ]);
        const decodeRefreshToken = await verifyToken(refreshToken);
        const user = await db.refreshToken.create({ refreshToken: refreshToken, exp: decodeRefreshToken.exp });
        return {
            success: true,
            message: USERS_MESSAGES.LOGIN_SUCCESS,
            role: role,
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
    async refreshToken(userID, exp, refreshToken, role) {
        const [new_access_token, new_refresh_token] = await Promise.all([
            signAccessToken({ userID: userID, role: role }),
            signReFreshToken({ userID: userID, exp: exp, role: role }),
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

        console.log('forgot_password_token: ', forgot_password_token);
        await sendEmail(
            `<h1>🕵️ click <a href="${process.env.CLIENT_URL}/verify_forgot_password_token?forgot_password_token=${forgot_password_token}">here</a> to reset password </h1>`,
            'PBL6_message',
            email,
        );
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
    async getProfile(userID) {
        const user = await db.Account.findOne({
            where: { id: userID },
            attributes: {
                exclude: ['password', 'forgot_password_token', 'id_role'],
            },
            include: [
                { model: db.Role, as: 'Role', attributes: ['id', 'roleName'] },
                {
                    model: db.inforUser,
                    as: 'inforUser',
                    attributes: ['firstname', 'lastname', 'phoneNumber', 'avatar'],
                },
            ],
        });
        return {
            success: true,
            user: user,
        };
    }
    async changePassword(userID, password) {
        await db.Account.update(
            {
                password: hashPassword(password),
                updatedAt: new Date(),
            },
            { where: { id: userID } },
        );
        return {
            success: true,
            message: USERS_MESSAGES.CHANGE_PASS_SUCCESS,
        };
    }
    async updateProfile(userID, data) {
        await db.inforUser.update(
            {
                ...data,
                updatedAt: new Date(),
            },
            {
                where: { id_account: userID },
            },
        );

        return {
            success: true,
            message: USERS_MESSAGES.UPDATE_MY_PROFILE_SUCCESS,
        };
    }
    async changeAvatar(userID, image) {
        await db.inforUser.update(
            {
                avatar: image.url,
            },
            {
                where: { id_account: userID },
            },
        );
        return {
            success: true,
            message: 'Change avatar successfully',
        };
    }
}
module.exports = new UserServices();
