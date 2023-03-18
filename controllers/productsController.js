const mysql = require("../mysql");
const { formatPath } = require("../utils/formatPath");

exports.getAllProducts = async (req, res, next) => {
  try {
    let productName = "";
    let categoryId = null;
    if (req.query.productName) {
      productName = req.query.productName;
    }
    if (req.query.categoryId) {
      categoryId = req.query.categoryId;
    }
    const query = `SELECT * FROM products`;
    const queryFilter = `SELECT * FROM products WHERE category_id = ? AND (product_name LIKE '%${productName}%');`;
    const result = await mysql.execute(categoryId ? queryFilter : query, [
      categoryId,
    ]);

    const response = {
      count: result.length,
      products: result.map((prod) => {
        return {
          product_id: prod.product_id,
          product_name: prod.product_name,
          product_price: prod.product_price,
          product_image: formatPath(prod.product_image),
          category: {
            category_id: prod.category_id
          },
          request: {
            type: "GET",
            description: "Returns the data of a specific product",
            url: `${process.env.URL_API}/products/${prod.product_id}`,
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

exports.createNewProduct = async (req, res, next) => {
  try {
    const query =
      "INSERT INTO products (product_name, product_price, product_image, category_id) VALUES (?, ?, ?, ?)";
    const result = await mysql.execute(query, [
      req.body.product_name,
      req.body.product_price,
      req.file.path,
      req.body.category_id,
    ]);
    const response = {
      message: "Product created successfully",
      product: {
        product_id: result.insertId,
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        category_id: req.body.category_id,
        product_image: req.file.path,
        request: {
          type: "GET",
          description: "Return all products",
          url: `${process.env.URL_API}/products`,
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

exports.getSpecificProduct = async (req, res, next) => {
  try {
    const query = "SELECT * FROM products WHERE product_id = ?;";
    const result = await mysql.execute(query, [req.params.productId]);
    if (result.length === 0) {
      return res.status(404).send({
        message: "Product not found",
      });
    }
    const response = {
      product: {
        product_id: result[0].product_id,
        product_name: result[0].product_name,
        product_price: result[0].product_price,
        product_image: result[0].product_image,
        category: {
          category_id: result[0].category_id,
        },
        request: {
          type: "GET",
          description: "Return all products",
          url: `${process.env.URL_API}/products`,
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

exports.updateSpecificProduct = async (req, res, next) => {
  try {
    const query =
      "UPDATE products SET product_name = ?, product_price = ? WHERE product_id = ?;";
    await mysql.execute(query, [
      req.body.product_name,
      req.body.product_price,
      req.params.productId,
    ]);
    const response = {
      message: "Product updated successfully",
      product: {
        product_id: parseInt(req.params.productId),
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        request: {
          type: "GET",
          description: "Returns the data of a specific product",
          url: `${process.env.URL_API}/products/${req.params.productId}`,
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

exports.deleteSpecificProduct = async (req, res, next) => {
  try {
    const query = "DELETE FROM products WHERE product_id = ?;";
    await mysql.execute(query, [req.params.productId]);
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
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};

exports.addImageToProduct = async (req, res, next) => {
  try {
    const query =
      "INSERT INTO product_images (product_id, image_path) VALUES (?, ?)";
    const result = await mysql.execute(query, [
      req.params.productId,
      req.file.path,
    ]);
    const response = {
      message: "Image added successfully",
      createdImage: {
        image_id: result.insertId,
        product_id: parseInt(req.params.productId),
        image_path: formatPath(req.file.path),
        request: {
          type: "GET",
          description: "Return all images of a specific product",
          url: `${process.env.URL_API}/products/${req.params.productId}/images`,
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

exports.getAllImagesOfSpecificProduct = async (req, res, next) => {
  try {
    const query = "SELECT * FROM product_images WHERE product_id = ?;";
    const result = await mysql.execute(query, [req.params.productId]);
    const response = {
      count: result.length,
      images: result.map((image) => {
        return {
          image_id: image.image_id,
          product_id: parseInt(req.params.productId),
          image_path: `${process.env.URL_API}/${formatPath(image.image_path)}`,
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
