const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ProposalSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  message : {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});
module.exports = Proposal = mongoose.model("Proposal", ProposalSchema, 'posts');