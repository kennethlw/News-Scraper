// Require Mongoose
const mongoose = require('mongoose');

// Create a Schema Class
var Schema = mongoose.Schema;

// Create Article Schema
var ArticleSchema = new Schema({

  // Title of Article
  title: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  // Link to Article
  url: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  saved: {
    type: Boolean,
    default:false
  }
});


// Create the Article model with Mongoose
var Article = mongoose.model('Article', ArticleSchema);

// Export the Model
module.exports = Article;