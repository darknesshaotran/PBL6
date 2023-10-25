const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const brandControllers = require('../controllers/brand.controllers');
const categoryControllers = require('../controllers/category.controllers');
const router = Router();
router.get('/', wrapController(categoryControllers.getCategoryList));
router.post('/add', wrapController(categoryControllers.addCategory));
router.delete('/delete/:id_brand', wrapController(categoryControllers.deleteCategory));

module.exports = router;
