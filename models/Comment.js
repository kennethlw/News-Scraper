// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var CommentSchema = new Schema({
  // Just a string
  author: {
  	type:String,
  	required: true
  },
  body: {
	type: String,
	required: true
  },
  createdAt: {
  	type:Date,
  	default: Date.now
  }
});


// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
