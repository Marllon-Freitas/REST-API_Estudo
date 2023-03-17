const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const categoriesController = require("../controllers/categoriesController");

router.get(
  "/",
  categoriesController.getAllCategories
);

router.post(
  "/",
  login.tokenRequired,
  categoriesController.createNewCategory
);

module.exports = router;