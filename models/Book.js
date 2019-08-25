const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isTranslated: {
    type: Boolean,
    default: false
  },
  translatorId: {
    type: String,
    required: false
  },
  publisherId: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: String,
    required: true
  }
});
module.exports = Book = mongoose.model("Book", BookSchema, 'books');