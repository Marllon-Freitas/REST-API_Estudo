const mysql = require("../mysql").pool;

exports.getAllProducts = (req, res, next) => {
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
      const response = {
        count: result.length,
        products: result.map((prod) => {
          return {
            product_id: prod.product_id,
            product_name: prod.product_name,
            product_price: prod.product_price,
            request: {
              type: "GET",
              description: "Returns the data of a specific product",
              url: `${process.env.URL_API}/products/${prod.product_id}`,
            },
          };
        }),
      };
      res.status(200).send(response);
    });
  });
};

exports.createNewProduct = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "INSERT INTO products (product_name, product_price, product_image) VALUES (?, ?, ?)",
      [req.body.product_name, req.body.product_price, req.file.path],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          message: "Product created successfully",
          product: {
            product_id: result.insertId,
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            product_image: req.file.path,
            request: {
              type: "GET",
              description: "Return all products",
              url: `${process.env.URL_API}/products`,
            },
          },
        };
        res.status(201).send(response);
      }
    );
  });
};

exports.getSpecificProduct = (req, res, next) => {
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
        const response = {
          product: {
            product_id: result[0].product_id,
            product_name: result[0].product_name,
            product_price: result[0].product_price,
            request: {
              type: "GET",
              description: "Return all products",
              url: `${process.env.URL_API}/products`,
            },
          },
        };
        res.status(200).send(response);
      }
    );
  });
};

exports.updateSpecificProduct = (req, res, next) => {
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

        const response = {
          message: "Product updated successfully",
          product: {
            product_id: req.params.productId,
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            request: {
              type: "GET",
              description: "Returns the data of a specific product",
              url: `${process.env.URL_API}/products/${req.params.productId}`,
            },
          },
        };
        res.status(200).send(response);
      }
    );
  });
};

exports.deleteSpecificProduct = (req, res, next) => {
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

        const response = {
          message: "Product deleted successfully",
          request: {
            type: "POST",
            description: "Create a new product",
            url: `${process.env.URL_API}/products`,
            body: {
              product_name: "String",
              product_price: "Number",
            },
          },
        };

        res.status(200).send(response);
      }
    );
  });
};
