const { Router } = require('express');
const { wrapController } = require('../utils/handle');

const router = Router();
const { AddShoesValidator, ShoesExistsValidator, UpdateShoesInfor } = require('../middlewares/shoes.middlewares');
const { FormdataValidator } = require('../middlewares/Formdata.middlewares');
const userControllers = require('../controllers/user.controllers');
const shoesControllers = require('../controllers/shoes.controllers');
const { accessTokenValidator, isAdminValidator } = require('../middlewares/user.middlewares');

router.post(
    '/add',
    accessTokenValidator,
    isAdminValidator,
    FormdataValidator,
    AddShoesValidator,
    wrapController(shoesControllers.addShoes),
);
router.post(
    '/add_size/:id_shoes',
    accessTokenValidator,
    isAdminValidator,
    ShoesExistsValidator,
    wrapController(shoesControllers.addSizeItem),
);
router.put(
    '/updateInfor/:id_shoes',
    accessTokenValidator,
    isAdminValidator,
    ShoesExistsValidator,
    UpdateShoesInfor,
    wrapController(shoesControllers.updateShoesInfor),
);
router.put(
    '/updateImages/:id_shoes',
    accessTokenValidator,
    isAdminValidator,
    ShoesExistsValidator,
    FormdataValidator,
    wrapController(shoesControllers.updateShoesImage),
);
router.delete(
    '/delete/:id_shoes',
    accessTokenValidator,
    isAdminValidator,
    ShoesExistsValidator,
    wrapController(shoesControllers.deleteShoes),
);
router.get('/:id_shoes', ShoesExistsValidator, wrapController(shoesControllers.shoesDetails));
router.get('/', wrapController(shoesControllers.showAllShoes));

module.exports = router;
