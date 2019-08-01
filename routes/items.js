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
  /*
    DELETE ITEM FROM DB
  */

  router.post('/delete', (req, res) => {
    const deleteItemQuery = {
      text: 'DELETE FROM items WHERE id = $1',
      values: [req.body.item_id],
    };

    db.query(deleteItemQuery)
      .then(data => {
        console.log('Deleted item with id: ', req.body.item_id);
        res.redirect('back');
      })
      .catch(err => {
        console.log(err);
      });
  });

  return router;
};
