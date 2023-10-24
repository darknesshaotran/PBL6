const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const {
    registerValidator,
    loginValidator,
    accessTokenValidator,
    refreshTokenValidator,
    forgotPasswordValidator,
    VerifyForgotPasswordTokenValidator,
    ResetPasswordValidator,
    UserExistValidator,
    ChangePasswordValidator,
} = require('../middlewares/user.middlewares.js');

const router = Router();

const userControllers = require('../controllers/user.controllers');
router.post('/register', registerValidator, wrapController(userControllers.register));
router.post('/login', loginValidator, wrapController(userControllers.login));
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapController(userControllers.logout));
router.post('/refreshToken', refreshTokenValidator, wrapController(userControllers.refreshToken));
router.post('/forgot-password', forgotPasswordValidator, wrapController(userControllers.forgotPassword));
router.post(
    '/verify-forgot-password',
    VerifyForgotPasswordTokenValidator,
    wrapController(userControllers.verifyForgotPassword),
);
router.post('/reset-password', ResetPasswordValidator, wrapController(userControllers.resetPassword));
router.get('/profile/me', accessTokenValidator, wrapController(userControllers.getMyprofile));
router.get('/profile/:userID', accessTokenValidator, UserExistValidator, wrapController(userControllers.getProfile));
router.post(
    '/change-password',
    accessTokenValidator,
    ChangePasswordValidator,
    wrapController(userControllers.changePassword),
);
module.exports = router;
