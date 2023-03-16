const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/ordersController");

router.get("/", ordersController.getAllOrders);

router.post("/", ordersController.createNewOrder);

router.get("/:orderId", ordersController.getSpecificOrder);

router.patch("/:orderId", ordersController.updateSpecificOrder);

router.delete("/:orderId", ordersController.deleteSpecificOrder);

module.exports = router;
