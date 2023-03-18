const mysql = require("../mysql");

exports.getAllCategories = async (req, res, next) => {
  try {
    const query = "SELECT * FROM categories;";
    const result = await mysql.execute(query);
    const response = {
      count: result.length,
      categories: result.map((category) => {
        return {
          category_id: category.category_id,
          category_name: category.category_name,
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

exports.createNewCategory = async (req, res, next) => {
  try {
    const query = "INSERT INTO categories (category_name) VALUES (?)";
    const result = await mysql.execute(query, [req.body.category_name]);
    const response = {
      message: "Category created successfully",
      createdCategory: {
        category_id: result.category_id,
        category_name: req.body.category_name,
        request: {
          type: "GET",
          description: "Return all categories",
          url: `${process.env.URL_API}/categories`,
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

exports.updateSpecificCategory = async (req, res, next) => {
  try {
    const query =
      "UPDATE categories SET category_name = ? WHERE category_id = ?";
    await mysql.execute(query, [
      req.body.category_name,
      req.params.categoryId,
    ]);
    const response = {
      message: "Category updated successfully, all products in this category were updated",
      updatedCategory: {
        category_id: parseInt(req.params.categoryId),
        category_name: req.body.category_name,
        request: {
          type: "GET",
          description: "Return all categories",
          url: `${process.env.URL_API}/categories`,
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