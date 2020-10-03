const { Router } = require("express");
const router = Router();
const productController = require("../controllers/productController");
const authorize = require('../Middleware/Auth')
const level = require('../config/level');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Upload_thumbnail/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + "." + file.originalname.split(".").pop());
    },
});
const upload = multer({ storage: storage });


router.post("/create", upload.single("thumbnail"), authorize(level.Admin), productController.create);
router.get("/get/:id", authorize(), productController.getById);
router.patch("/update/:id", authorize(level.Admin), productController.updateById);
router.delete("/delete/:id", authorize(level.Admin), productController.deleteById);
router.get("/all", authorize(), productController.getAllList);


module.exports = router;