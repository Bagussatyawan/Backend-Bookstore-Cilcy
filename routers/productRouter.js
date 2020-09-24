const { Router } = require('express');
const router = Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'Upload_thumbnail/' });

router.post('/create', upload.single('thumbnail'), productController.create);
router.get('/get/:id', productController.getById);
router.patch('/update/:id', productController.updateById);
router.delete('/delete/:id', productController.deleteById);
router.get('/all', productController.getAllList);


module.exports = router;