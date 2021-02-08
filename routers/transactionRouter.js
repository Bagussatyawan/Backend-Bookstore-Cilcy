const { Router } = require('express');
const router = Router();
const transactionController = require('../controllers/transactionController');
const authorize = require('../Middleware/Auth')
// const level = require('../config/level');

router.post('/create', authorize(), transactionController.create);
router.post('/update', authorize(), transactionController.update);
router.get('/get/:id', authorize(), transactionController.getById);
router.get('/all/:id', authorize(), transactionController.getAllList);
router.post('/checkout', authorize(), transactionController.checkout);
router.get('/allorder/:user_id', authorize(), transactionController.getAllOrder);


module.exports = router;