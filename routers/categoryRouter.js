const { Router } = require('express');
const router = Router();
const categoryController = require('../controllers/categoryController');

router.post('/create', categoryController.create);
router.get('/get/:id', categoryController.getById);
router.patch('/update/:id', categoryController.updateById);
router.delete('/delete/:id', categoryController.deleteById);
router.get('/all', categoryController.getAllList);

module.exports = router;