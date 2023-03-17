const express = require("express");
const router = express.Router();
const multer = require("multer");
const login = require("../middleware/login");

const productsController = require("../controllers/productsController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    let data = new Date().toISOString().replace(/:/g, "-") + "-";
    cb(null, data + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", productsController.getAllProducts);

router.post(
  "/",
  login.tokenRequired,
  upload.single("product_image"),
  productsController.createNewProduct
);

router.get("/:productId", productsController.getSpecificProduct);

router.patch(
  "/:productId",
  login.tokenRequired,
  productsController.updateSpecificProduct
);

router.delete(
  "/:productId",
  login.tokenRequired,
  productsController.deleteSpecificProduct
);

router.post(
  "/:productId/image",
  login.tokenRequired,
  upload.single("product_image"),
  productsController.addImageToProduct
);

router.get(
  "/:productId/images",
  productsController.getAllImagesOfSpecificProduct
);

module.exports = router;
