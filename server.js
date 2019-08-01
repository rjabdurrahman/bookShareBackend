const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const proposal = require("./routes/api/proposal");

const app = express();
// Bodyparser 
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

const db = 'mongodb://localhost:27017/bookshare';

// const db = require("./config/keys").mongoURI;
// MongoDB Connect
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth");
  next();
});
// Passport 
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/proposal", proposal);
app.use("/api/profile", profile);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));