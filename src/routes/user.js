const { Router } = require('express');
const router = Router();
router.get('/a', (req, res, next) => {
    return res.send('welcome ');
});
module.exports = router;
