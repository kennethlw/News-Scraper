// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
// Requiring our Note and Article models
const Comment = require("./models/Comment.js");
const Article = require("./models/Article.js");
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

//set up our handlebars front end
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
if (process.env.MONGODB_URI) {
 mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect("mongodb://localhost/news-scraper");
}

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.use(require('./controllers/routes'));



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
