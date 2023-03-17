const mysql = require("../mysql");

exports.getAllOrders = async (req, res, next) => {
  try {
    const query = `SELECT orders.order_id,
              orders.order_quantity, 
              products.product_id, 
              products.product_name, 
              products.product_price 
      FROM orders 
      INNER JOIN products 
      ON products.product_id = orders.product_id;
      `;
    const result = await mysql.execute(query);
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
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};

exports.createNewOrder = async (req, res, next) => {
  try {
    const queryProduct = "SELECT * FROM products WHERE product_id = ?";
    const resultProduct = await mysql.execute(queryProduct, [
      req.body.product_id,
    ]);
    if (resultProduct.length === 0) {
      return res.status(404).send({
        message: "Product not found",
      });
    }
    const queryOrder =
      "INSERT INTO orders (product_id, order_quantity) VALUES (?, ?)";
    const resultOrder = await mysql.execute(queryOrder, [
      req.body.product_id,
      req.body.order_quantity,
    ]);
    const response = {
      message: "Order created successfully",
      createdOrder: {
        order_id: resultOrder.insertId,
        product_id: req.body.product_id,
        order_quantity: req.body.order_quantity,
        request: {
          type: "GET",
          description: "Returns the data of all orders",
          url: `${process.env.URL_API}/orders`,
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};

exports.getSpecificOrder = async (req, res, next) => {
  try {
    const query = "SELECT * FROM orders WHERE order_id = ?";
    const result = await mysql.execute(query, [req.params.orderId]);
    if (result.length === 0) {
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
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};

exports.updateSpecificOrder = async (req, res, next) => {
  try {
    const query =
      "UPDATE orders SET product_id = ?, order_quantity = ? WHERE order_id = ?;";
    await mysql.execute(query, [
      req.body.product_id,
      req.body.order_quantity,
      req.params.orderId,
    ]);
    const response = {
      message: "Order updated successfully",
      order: {
        order_id: parseInt(req.params.orderId),
        product_id: req.body.product_id,
        order_quantity: req.body.order_quantity,
        request: {
          type: "GET",
          description: "Returns the data of a specific order",
          url: `${process.env.URL_API}/orders/${req.params.orderId}`,
        },
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};

exports.deleteSpecificOrder = async (req, res, next) => {
  try {
    const query = "DELETE FROM orders WHERE order_id = ?;";
    await mysql.execute(query, [req.params.orderId]);
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
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};
