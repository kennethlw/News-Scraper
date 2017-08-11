const express = require('express');
const router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');
var Article = require('../models/Article');
var Comment = require('../models/Comment');

// Routes
// ======
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/scrape', function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.reddit.com", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("p.title").each(function(i, element) {

      // Add the text and href of every link, and save them as properties of the result object
      var title = $(this).text();
      var url = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var newArticle = new Article({
        title: title,
        url: url
      });

      // Now, save that entry to the db
      var promise = Article.find({title: title, url: url }).exec();
      promise.then(function(res) {
        if(res.length === 0) {
        newArticle.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          console.log("Article saved");
        }
       });
      }
    });
  }); //end the each
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
 }); //close the request
}); //close the get

// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {

    Article.find({ saved: false}).exec(function(err,doc) {
      if (err) console.log(err)
     else res.json(doc);
    });

});

router.get("/articles/saved", function(req, res) {
  Article.find({ saved: true }).exec(function(err, doc) {
    if (err) console.log(err);
    else res.json(doc);
  });
});

router.get("/saved", function(req, res) {
  res.render("saved");
});

router.get("/articles/:id", function(req, res) {
  Article.findOne({ _id: req.params.id }).populate("comment").exec(function(err, doc) {
    if (err) console.log(err);
    else res.json(doc);
  });
});

router.post("/articles/saved/:id", function(req, res) {
  Article.findOneAndUpdate({ _id: req.params.id }, { saved: req.body.saved}).exec(function(err, doc) {
    if (err) console.log(err);
    else res.json(doc);
  });
});

router.post("/articles/comment/:id", function(req, res) {
  var newComment = new Comment(req.body);
  newComment.save(function(err, doc) {
    if (err) console.log(err);
    else {
      Article.findOneAndUpdate({_id: req.params.id}, { $push: {comment: doc._id}}, {new: true}, function(error, newdoc) {
        if (error) console.log(error);
        else res.send(newdoc);
      });
    }
  });
});

router.delete("/articles/comment/:id", function(req, res) {
  Comment.findOne({ _id: req.params.id }).remove().exec(function(err, doc) {
    if (err) console.log(err);
    else {
      Article.findOneAndUpdate({ _id: req.body.id}, { $pull: {comment: req.params.id }}, function(error, newdoc) {
        if (error) console.log(error);
        else res.send(newdoc);
      });
    }
  });
});


module.exports = router;
