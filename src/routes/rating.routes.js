const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const router = Router();

const ratingControllers = require('../controllers/rating.controllers');
const {
    RatingExistsValidator,
    AddRatingValidator,
    UpdateRatingValidator,
} = require('../middlewares/rating.middlewares');

router.post('/add', accessTokenValidator, AddRatingValidator, wrapController(ratingControllers.addRating));
router.delete(
    '/delete/:id_rating',
    accessTokenValidator,
    RatingExistsValidator,
    wrapController(ratingControllers.deleteRating),
);
router.put(
    '/update/:id_rating',
    accessTokenValidator,
    RatingExistsValidator,
    UpdateRatingValidator,
    wrapController(ratingControllers.updateRating),
);
module.exports = router;
