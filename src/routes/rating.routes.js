const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const router = Router();

const ratingControllers = require('../controllers/rating.controllers');

router.post('/add', accessTokenValidator, wrapController(ratingControllers.addRating));
router.delete('/delete/:id_rating', accessTokenValidator, wrapController(ratingControllers.deleteRating));
router.put('/update/:id_rating', accessTokenValidator, wrapController(ratingControllers.updateRating));
module.exports = router;
