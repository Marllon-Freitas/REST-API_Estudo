const express = require("express");
const router = express.Router();

// Get all orders
router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "Handling GET requests to /orders",
  });
});

// Create a new order
router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).send({
    message: "Handling POST requests to /orders",
    createdOrder: order,
  });
});

// Get a specific order
router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).send({
    message: "Handling ids using GET requests to /orders/:orderId",
    id: id,
  });
});

// Update a specific order
router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).send({
    message: "Handling ids using PATCH requests to /orders/:orderId",
    id: id,
  });
});

// Delete a specific order
router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).send({
    message: "Handling ids using DELETE requests to /orders/:orderId",
    id: id,
  });
});

module.exports = router;
