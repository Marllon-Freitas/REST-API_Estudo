const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signupUser = async (req, res, next) => {
  try {
    const queryVerifyUser = `SELECT * FROM users WHERE user_email = ?`;
    const resultVerifyUser = await mysql.execute(queryVerifyUser, [
      req.body.user_email,
    ]);
    if (resultVerifyUser.length === 0) {
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(req.body.user_password, 10, (errBcrypt, hash) => {
          if (errBcrypt) {
            reject(errBcrypt);
          } else {
            resolve(hash);
          }
        });
      });
      const queryInsertUser = `INSERT INTO users (user_email, user_password) VALUES (?, ?)`;
      await mysql.execute(queryInsertUser, [
        req.body.user_email,
        hashedPassword,
      ]);
      const response = {
        message: "User created successfully",
        createdUser: {
          user_id: resultVerifyUser.insertId,
          email: req.body.user_email,
        },
      };
      return res.status(201).send(response);
    }
    return res.status(409).send({
      message: "User already exists",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const query = `SELECT * FROM users WHERE user_email = ?`;
    const result = await mysql.execute(query, [req.body.user_email]);
    if (result.length === 0) {
      return res.status(401).send({
        message: "Authentication failed",
      });
    }
    bcrypt.compare(
      req.body.user_password,
      result[0].user_password,
      (err, resultBcrypt) => {
        if (err) {
          return res.status(401).send({
            message: "Authentication failed",
          });
        }
        if (resultBcrypt) {
          const token = jwt.sign(
            {
              user_id: result[0].user_id,
              user_email: result[0].user_email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).send({
            message: "Authentication successful",
            token: token,
          });
        }
        return res.status(401).send({
          message: "Authentication failed",
        });
      }
    );
  } catch (error) {
    return res.status(500).send({
      error: error,
      response: null,
    });
  }
};
