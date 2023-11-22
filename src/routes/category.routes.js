const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const brandControllers = require('../controllers/brand.controllers');
const categoryControllers = require('../controllers/category.controllers');
const { FormdataValidator } = require('../middlewares/Formdata.middlewares');
const router = Router();
router.post('/add', FormdataValidator, wrapController(categoryControllers.addCategory));
router.delete('/delete/:id_category', wrapController(categoryControllers.deleteCategory));
router.get('/', wrapController(categoryControllers.getCategoryList));

module.exports = router;
