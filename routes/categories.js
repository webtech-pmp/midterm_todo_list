/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/categories,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM categories;`)
      .then(data => {
        const categories = data.rows;
        console.log(categories);
        res.json({
          categories
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({
            error: err.message
          });
      });
  });
  return router;
};

