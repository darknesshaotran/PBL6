const { Router } = require('express');
const { wrapController } = require('../utils/handle');

const router = Router();

const userControllers = require('../controllers/user.controllers');
const shoesControllers = require('../controllers/shoes.controllers');

router.post('/add', wrapController(shoesControllers.addShoes));
router.put('/updateInfor/:id_shoes', wrapController(shoesControllers.updateShoesInfor));
router.delete('/delete/:id_shoes', wrapController(shoesControllers.deleteShoes));
router.get('/:id_shoes', wrapController(shoesControllers.shoesDetails));
router.get('/', wrapController(shoesControllers.showAllShoes));

module.exports = router;
