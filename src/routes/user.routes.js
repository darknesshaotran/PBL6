const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { loginValidator } = require('../middlewares/user.middlewares.js');

const router = Router();

const UserController = require('../controllers/user.controllers');
router.get('/', loginValidator, wrapController(UserController.register));
module.exports = router;
