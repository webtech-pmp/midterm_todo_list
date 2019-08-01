// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
const request = require('request');

// PG database client/connection setup
const {
  Pool
} = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


app.get("/", (req, res) => {
  res.render("index");
});

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");
const categoriesRoutes = require('./routes/categories');
const itemsRoutes = require('./routes/items');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
app.use('/api/categories', categoriesRoutes(db));
app.use('/api/items', itemsRoutes(db));
// Note: mount other resources here, using the same pattern above


/* ---------------------

Move these afterwards to routes file?

-- -- -- -- -- -- -- -- -- -- - */

app.get('/home', (req, res) => {
  const templateVars = {
    itemAdded: req.query.added_item,
  };
  res.render("home", templateVars);
});

app.get('/category/restaurants', (req, res) => {
  const selectItemsQuery = {
    text: 'SELECT * FROM items WHERE id IN (SELECT item_id FROM category_item_mapping WHERE category_id = $4)',
    values: [1],
  };
  db.query(selectItemsQuery)
    .then(data => {
      const templateVars = {
        items: data.rows,
      };
      res.render("category_restaurants", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: err.message
        });
    });
});

//TEST Yelp api call
app.post("/select_category", (req, res) => {
  console.log('inside yelp add_item');
  const YELP_TOKEN = '4rgeJl4MWKT0_htmTNmRsp8crNmlf9RNVMlk97Gil4lIqb4InH7sqFB4b8UXiLmVLkerUeodJ20Ru141jC-yLgLrwVk7NiPthMT8KM3ZOTtWvOzpBpXXESmXSXc_XXYx';
  const yelp = {
    url: 'https://api.yelp.com/v3/businesses/search?location=Vancouver&categories=restaurants&term=' + req.body.item,
    headers: {
      'Authorization': 'Bearer ' + YELP_TOKEN
    }
  };

  console.log('inside omdb add_item');
  const OMDb_TOKEN = '236d915d'
  const omdb = {
    url: 'http://www.omdbapi.com/?t=' + req.body.item,
    headers: {
      'Authorization': 'Bearer' + OMDb_TOKEN
    }
  };

  const GOODREADS_TOKEN = 'hcXimhWDj8lzNDDmReOnw'
  const goodreads = {
    url: 'https://www.goodreads.com/search.xml?title=' + req.body.item,
    headers: {
      'Authorization': 'Bearer' + GOODREADS_TOKEN
    }
  };

  request(yelp, function (error, response, body) {
    const isRestaurant = JSON.parse(body).total > 0;

    const templateVars = {
      term: req.body.term,
      error: '',
      movie: isMovie,
      book: isBook,
      product: isProduct,
      restaurant: isRestaurant,
    };

    res.render('add_item', templateVars);
  });
  //   });
  // });
});

/*
// ADD item into DB
*/

app.post('/add_item', (req, res) => {
  let category = req.body.category;
  console.log('start of add_item route');
  // Checking if no category was selected
  if (!category || !category.length) {
    const templateVars = {
      term: req.body.term,
      error: 'Choose at least one category',
      movie: false,
      book: false,
      product: false,
      restaurant: false,
    };

    return res.render('add_item', templateVars);
  }
  console.log("OMG its here!");
  const addItemQuery = {
    text: 'INSERT INTO items(name, done) VALUES ($1, $2) RETURNING id',
    values: [req.body.term, false],
  };

  // Adding item to items table
  db.query(addItemQuery)
    .then(data => {
      const itemId = data.rows[0].id;

      if (!Array.isArray(category)) {
        category = [category];
      }

      // Adding category mapping for every chosen category
      category.forEach(categoryId => {
        const addCategoryQuery = {
          text: 'INSERT INTO category_item_mapping(category_id, item_id) VALUES ($1, $2)',
          values: [categoryId, itemId],
        };

        db.query(addCategoryQuery)
          .then(data => {
            console.log('Added item with id: ', itemId);
            res.redirect('home?added_item=' + req.body.term);
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
