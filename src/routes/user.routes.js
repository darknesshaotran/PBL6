const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const router = Router();

const UserController = require('../controllers/user.controllers');
router.get('/', wrapController(UserController.register));
module.exports = router;
