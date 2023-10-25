const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const brandControllers = require('../controllers/brand.controllers');
const router = Router();
router.get('/', wrapController(brandControllers.getBrandList));
router.post('/add', wrapController(brandControllers.addBrand));
router.delete('/delete/:id_brand', wrapController(brandControllers.deleteBrand));

module.exports = router;
