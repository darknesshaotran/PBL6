const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const brandControllers = require('../controllers/brand.controllers');
const { FormdataValidator } = require('../middlewares/Formdata.middlewares');
const router = Router();
router.get('/', wrapController(brandControllers.getBrandList));
router.post('/add', FormdataValidator, wrapController(brandControllers.addBrand));
router.delete('/delete/:id_brand', wrapController(brandControllers.deleteBrand));

module.exports = router;
