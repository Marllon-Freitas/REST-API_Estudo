const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// sign up the user
router.post("/signup", (req, res, next) => {
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

// login the user
router.post("/login", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    const query = `SELECT * FROM users WHERE user_email = ?`;

    conn.query(query, [req.body.user_email], (error, results, field) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
          response: null,
        });
      }
      if (results.length < 1) {
        return res.status(401).send({
          message: "Authentication failed",
        });
      }
      bcrypt.compare(
        req.body.user_password,
        results[0].user_password,
        (err, result) => {
          if (err) {
            return res.status(401).send({
              message: "Authentication failed",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                user_id: results[0].user_id,
                user_email: results[0].user_email,
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
    });
  });
});

module.exports = router;
