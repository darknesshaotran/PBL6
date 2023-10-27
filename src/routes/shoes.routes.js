const { Router } = require('express');
const { wrapController } = require('../utils/handle');

const router = Router();
const { AddShoesValidator } = require('../middlewares/shoes.middlewares');
const { FormdataValidator } = require('../middlewares/Formdata.middlewares');
const userControllers = require('../controllers/user.controllers');
const shoesControllers = require('../controllers/shoes.controllers');

router.post('/add', FormdataValidator, AddShoesValidator, wrapController(shoesControllers.addShoes));
router.put('/updateInfor/:id_shoes', wrapController(shoesControllers.updateShoesInfor));
router.put('/updateImages/:id_shoes', FormdataValidator, wrapController(shoesControllers.updateShoesImage));
router.delete('/delete/:id_shoes', wrapController(shoesControllers.deleteShoes));
router.get('/:id_shoes', wrapController(shoesControllers.shoesDetails));
router.get('/', wrapController(shoesControllers.showAllShoes));

module.exports = router;
