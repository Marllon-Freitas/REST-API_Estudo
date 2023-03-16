const mysql = require("../mysql").pool;

exports.getAllOrders = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      `SELECT orders.order_id,
              orders.order_quantity, 
              products.product_id, 
              products.product_name, 
              products.product_price 
      FROM orders 
      INNER JOIN products 
      ON products.product_id = orders.product_id;
      `,
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          count: result.length,
          orders: result.map((order) => {
            return {
              order_id: order.order_id,
              product: {
                product_id: order.product_id,
                product_name: order.product_name,
                product_price: order.product_price,
              },
              order_quantity: order.order_quantity,
              request: {
                type: "GET",
                description: "Returns the data of a specific order",
                url: `${process.env.URL_API}/orders/${order.order_id}`,
              },
            };
          }),
        };
        res.status(200).send(response);
      }
    );
  });
}

exports.createNewOrder = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "SELECT * FROM products WHERE product_id = ?",
      [req.body.product_id],
      (error, result, field) => {
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
        conn.query(
          "INSERT INTO orders (product_id, order_quantity) VALUES (?, ?)",
          [req.body.product_id, req.body.order_quantity],
          (error, result, field) => {
            conn.release();
            if (error) {
              return res.status(500).send({
                error: error,
                response: null,
              });
            }
            const response = {
              message: "Order created successfully",
              createdOrder: {
                order_id: result.order_id,
                product_id: req.body.product_id,
                order_quantity: req.body.order_quantity,
                request: {
                  type: "GET",
                  description: "Returns the data of all orders",
                  url: `${process.env.URL_API}/orders`,
                },
              },
            };
            res.status(201).send(response);
          }
        );
      }
    );
  });
}

exports.getSpecificOrder = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "SELECT * FROM orders WHERE order_id = ?;",
      [req.params.orderId],
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
            message: "Order not found",
          });
        }
        const response = {
          order: {
            order_id: result[0].order_id,
            product_id: result[0].product_id,
            order_quantity: result[0].order_quantity,
            request: {
              type: "GET",
              description: "Return all orders",
              url: `${process.env.URL_API}/orders`,
            },
          },
        };
        res.status(200).send(response);
      }
    );
  });
}

exports.updateSpecificOrder = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "UPDATE orders SET product_id = ?, order_quantity = ? WHERE order_id = ?;",
      [req.body.product_id, req.body.order_quantity, req.params.orderId],
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
            order_id: req.params.orderId,
            product_id: req.body.product_id,
            order_quantity: req.body.order_quantity,
            request: {
              type: "GET",
              description: "Returns the data of a specific product",
              url: `${process.env.URL_API}/products/${req.params.orderId}`,
            },
          },
        };
        res.status(200).send(response);
      }
    );
  });
}

exports.deleteSpecificOrder = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      "DELETE FROM orders WHERE order_id = ?;",
      [req.params.orderId],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }

        const response = {
          message: "Order deleted successfully",
          request: {
            type: "POST",
            description: "Create a new order",
            url: `${process.env.URL_API}/order`,
            body: {
              product_id: "Number",
              order_quantity: "Number",
            },
          },
        };

        res.status(200).send(response);
      }
    );
  });
}