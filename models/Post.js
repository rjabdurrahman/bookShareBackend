const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PostSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  skills : {
    type: Array,
    required: true
  },
  proposals : {
    type: Array,
    default: []
  }
});
module.exports = Post = mongoose.model("Post", PostSchema, 'posts');