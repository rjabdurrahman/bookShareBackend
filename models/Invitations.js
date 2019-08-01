const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const InvitationSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  }
});
module.exports = Invitation = mongoose.model("Invitation", InvitationSchema, 'invitation');