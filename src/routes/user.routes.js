const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const {
    registerValidator,
    loginValidator,
    accessTokenValidator,
    refreshTokenValidator,
} = require('../middlewares/user.middlewares.js');

const router = Router();

const UserController = require('../controllers/user.controllers');
const userControllers = require('../controllers/user.controllers');
router.post('/register', registerValidator, wrapController(UserController.register));
router.post('/login', loginValidator, wrapController(UserController.login));
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapController(userControllers.logout));
router.post('/refreshToken', refreshTokenValidator, wrapController(UserController.refreshToken));
module.exports = router;
