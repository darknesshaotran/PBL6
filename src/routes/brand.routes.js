const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator, isAdminValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const brandControllers = require('../controllers/brand.controllers');
const { FormdataValidator } = require('../middlewares/Formdata.middlewares');
const router = Router();
router.get('/', wrapController(brandControllers.getBrandList));
router.post(
    '/add',
    accessTokenValidator,
    isAdminValidator,
    FormdataValidator,
    wrapController(brandControllers.addBrand),
);
router.delete(
    '/delete/:id_brand',
    accessTokenValidator,
    isAdminValidator,
    wrapController(brandControllers.deleteBrand),
);

module.exports = router;
