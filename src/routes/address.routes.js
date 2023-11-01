const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const addressControllers = require('../controllers/address.controllers');
const {
    AddAddressValidator,
    AddressExistsValidator,
    UpdateAddressValidator,
} = require('../middlewares/address.middlewares');
const router = Router();
router.get('/', accessTokenValidator, wrapController(addressControllers.getAddressList));
router.post('/add', accessTokenValidator, AddAddressValidator, wrapController(addressControllers.addAddress));
router.delete('/delete/:id_address', AddressExistsValidator, wrapController(addressControllers.deleteAddress));
router.put(
    '/update/:id_address',
    AddressExistsValidator,
    UpdateAddressValidator,
    wrapController(addressControllers.updateAddress),
);

module.exports = router;
