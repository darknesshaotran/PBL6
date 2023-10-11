const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { registerValidator, loginValidator, accessTokenValidator } = require('../middlewares/user.middlewares.js');

const router = Router();

const UserController = require('../controllers/user.controllers');
router.get('/register', registerValidator, wrapController(UserController.register));
router.get('/login', loginValidator, wrapController(UserController.login));
module.exports = router;
