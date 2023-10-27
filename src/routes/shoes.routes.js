const { Router } = require('express');
const { wrapController } = require('../utils/handle');

const router = Router();
const { AddShoesValidator, ShoesExistsValidator, UpdateShoesInfor } = require('../middlewares/shoes.middlewares');
const { FormdataValidator } = require('../middlewares/Formdata.middlewares');
const userControllers = require('../controllers/user.controllers');
const shoesControllers = require('../controllers/shoes.controllers');

router.post('/add', FormdataValidator, AddShoesValidator, wrapController(shoesControllers.addShoes));
router.put(
    '/updateInfor/:id_shoes',
    ShoesExistsValidator,
    UpdateShoesInfor,
    wrapController(shoesControllers.updateShoesInfor),
);
router.put(
    '/updateImages/:id_shoes',
    ShoesExistsValidator,
    FormdataValidator,
    wrapController(shoesControllers.updateShoesImage),
);
router.delete('/delete/:id_shoes', ShoesExistsValidator, wrapController(shoesControllers.deleteShoes));
router.get('/:id_shoes', ShoesExistsValidator, wrapController(shoesControllers.shoesDetails));
router.get('/', wrapController(shoesControllers.showAllShoes));

module.exports = router;
