const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// Get all products
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query("SELECT * FROM products;", (error, result, field) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
          response: null,
        });
      }
      res.status(200).send({
        message: "Handling GET requests to /products",
        products: result,
      });
    });
  });
});

// Create a new product
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "INSERT INTO products (product_name, product_price) VALUES (?, ?)",
      [req.body.product_name, req.body.product_price],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          message: "Product created successfully",
          product_id: result.insertId,
        });
      }
    );
  });
});

// Get a specific product
router.get("/:productId", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "SELECT * FROM products WHERE product_id = ?;",
      [req.params.productId],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            message: "Product not found",
          });
        }
        res.status(200).send({
          message: "Handling GET requests to /products/:productId",
          product: result,
        });
      }
    );
  });
});

// Update a specific product
router.patch("/:productId", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "UPDATE products SET product_name = ?, product_price = ? WHERE product_id = ?;",
      [req.body.product_name, req.body.product_price, req.params.productId],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(200).send({
          message: "Product updated successfully",
        });
      }
    );
  });
});

// Delete a specific product
router.delete("/:productId", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "DELETE FROM products WHERE product_id = ?;",
      [req.params.productId],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(200).send({
          message: "Product deleted successfully",
        });
      }
    );
  });
});

module.exports = router;
