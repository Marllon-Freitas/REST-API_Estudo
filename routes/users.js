const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");

// sign in user
router.post("/signin", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      `SELECT * FROM users WHERE user_email = ?`,
      [req.body.user_email],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        if (result.length > 0) {
          res.status(409).send({
            message: "User already exists",
          });
        } else {
          bcrypt.hash(req.body.user_password, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({
                error: errBcrypt,
                response: null,
              });
            }
            conn.query(
              `INSERT INTO users (user_email, user_password) VALUES (?, ?)`,
              [req.body.user_email, hash],
              (error, result, field) => {
                conn.release();
                if (error) {
                  return res.status(500).send({
                    error: error,
                    response: null,
                  });
                }
                const response = {
                  message: "User created successfully",
                  createdUser: {
                    user_id: result.insertId,
                    email: req.body.email,
                  },
                };
                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
});

module.exports = router;
