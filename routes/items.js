/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/items,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/add_item", (req, res) => {
  });
  return router;
};
