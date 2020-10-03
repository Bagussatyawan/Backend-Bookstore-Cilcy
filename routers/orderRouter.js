const { Router } = require('express');
const router = Router();
const orderController = require('../controllers/orderController');
const authorize = require('../Middleware/Auth');
// const level = require('../config/level');

router.post('/create', authorize(), orderController.order);
router.get("/get/:id", authorize(), orderController.getById);
router.patch("/update/:id", authorize(), orderController.update);
router.delete("/delete/:id", authorize(), orderController.deleteById);
router.get("/all", authorize(), orderController.getAllList);


module.exports = router;