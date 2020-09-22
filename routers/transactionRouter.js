const { Router } = require('express');
const router = Router();
const transactionController = require('../controllers/transactionController');

router.post('/create', transactionController.create);



module.exports = router;