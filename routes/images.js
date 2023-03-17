const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const imagesController = require("../controllers/ImagesController");

router.delete(
  "/:imageId",
  login.tokenRequired,
  imagesController.deleteSpecificImage
);

module.exports = router;