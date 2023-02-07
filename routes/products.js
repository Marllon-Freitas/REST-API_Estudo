const express = require("express");
const router = express.Router();

// Get all products
router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "Handling GET requests to /products",
  });
});

// Create a new product
router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(201).send({
    message: "Handling POST requests to /products",
    createdProduct: product,
  });
});

// Get a specific product
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  res.status(200).send({
    message: "Handling ids using GET requests to /products/:productId",
    id: id,
  });
});

// Update a specific product
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  res.status(200).send({
    message: "Handling ids using PATCH requests to /products/:productId",
    id: id,
  });
});

// Delete a specific product
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  res.status(200).send({
    message: "Handling ids using DELETE requests to /products/:productId",
    id: id,
  });
});

module.exports = router;
