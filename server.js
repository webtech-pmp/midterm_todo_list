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


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/index", (req, res) => {
  res.render("index");
});

/* ---------------------

Move these afterwards

-- -- -- -- -- -- -- -- -- -- - */

app.get('/home', (req, res) => {
  res.render("home");

})
// YELP
app.post('/add_item', (req, res) => {
  const templateVars = {
    location: location,
    categories: 'restaurants',
    term: term,
    total: total
  }
  res.render('add_item', templateVars);
})

//TEST Yelp api call
app.get("/add_item", (req, res) => {
  const TOKEN = 'ui-PokEWvbB2QxjP96b2B1lf7Lo9vbhBUvm1cWAolxsi7nfcS7dJ6WU34QQLjTw9_Mq5aBiGUodUVWcHtA6eKLlmzElLxwPxLVqIV_7z71ixxcAhtvUfdpZpZ5c7XXYx';
  const options = {
    url: 'https://api.yelp.com/v3/businesses/search?location=Vancouver&categories=restaurants&term=' + req.query.item,
    headers: {
      'Authorization': 'Bearer ' + TOKEN
    }

  };

<<<<<<< HEAD
  // const yelpRequest = request(options, function(error, response, body) {
  //   const parsedBody = JSON.parse(body);
  //   console.log('total yelp results:', parsedBody.total); // Print the HTML for the Google homepage.
  // });

  res.render('add_item');
=======
  request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', JSON); // Print the HTML for the Google homepage.
  });
  res.render('index');
>>>>>>> 702adaa040baa43c948050750af9055b645c8c02
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
