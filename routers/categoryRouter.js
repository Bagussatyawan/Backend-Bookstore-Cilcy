const { Router } = require('express');
const router = Router();
const categoryController = require('../controllers/categoryController');
const authorize = require('../Middleware/Auth')
const level = require('../config/level');

router.post('/create', authorize(level.Admin), categoryController.create);
router.get('/get/:id', authorize(), categoryController.getById);
router.patch('/update/:id', authorize(level.Admin), categoryController.updateById);
router.delete('/delete/:id', authorize(level.Admin), categoryController.deleteById);
router.get('/all', authorize(), categoryController.getAllList);

module.exports = router;