const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const { uploadImage, handleFormData } = require('../utils/fileHandle');
const shoesServices = require('../services/shoes.services');
const ratingServices = require('../services/rating.services');

class RatingController {
    async addRating(req, res, next) {
        const { id_shoes, star, comment } = req.body;
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await ratingServices.addRating(star, comment, userID, id_shoes);
        res.json(result);
    }
    async deleteRating(req, res, next) {
        const { id_rating } = req.params;
        const result = await ratingServices.deleteRating(id_rating);
        res.json(result);
    }
    async updateRating(req, res, next) {
        const { id_rating } = req.params;
        const { star, comment } = req.body;
        const result = await ratingServices.updateRating(star, comment, id_rating);
        res.json(result);
    }
}
module.exports = new RatingController();