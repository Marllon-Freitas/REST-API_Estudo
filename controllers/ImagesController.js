const mysql = require("../mysql");

exports.deleteSpecificImage = async (req, res, next) => {
  try {
    const query = "DELETE FROM product_images WHERE image_id = ?;";
    await mysql.execute(query, [req.params.imageId]);
    const response = {
      message: "Image deleted successfully",
      request: {
        type: "POST",
        description: "Add a new image to a product",
        url: `${process.env.URL_API}/products/${req.body.product_id}/image`,
        body: {
          product_id: "Number",
          product_image: "File",
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
