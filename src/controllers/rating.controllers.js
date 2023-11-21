const ratingServices = require('../services/rating.services');

class RatingController {
    async addRating(req, res, next) {
        const { id_shoes, id_order_item, star, comment } = req.body;
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const result = await ratingServices.addRating(star, comment, userID, id_shoes, id_order_item);
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
