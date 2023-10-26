const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const Account = require('../models/account');
const inforUser = require('../models/inforuser');
const hashPassword = require('../utils/crypto');
const USERS_MESSAGES = require('../constants/messages');
const { signAccessToken, signReFreshToken, verifyToken, signForgotPasswordToken } = require('../utils/JWT');
const HTTP_STATUS = require('../constants/httpStatus');

class RatingServices {
    async addRating(star, comment, userID, id_shoes) {
        await db.Rating.create({
            star: Number(star),
            comment: comment,
            id_account: userID,
            id_shoes: id_shoes,
        });
        return {
            success: true,
            message: 'Add rating successfully',
        };
    }
    async deleteRating(id_rating) {
        await db.Rating.destroy({
            where: { id: id_rating },
        });
        return {
            success: true,
            message: 'Delete rating successfully',
        };
    }
    async updateRating(star, comment, id_rating) {
        await db.Rating.update(
            {
                star: star,
                comment: comment,
            },
            {
                where: { id: id_rating },
            },
        );
        return {
            success: true,
            message: 'Update rating successfully',
        };
    }
}
module.exports = new RatingServices();
