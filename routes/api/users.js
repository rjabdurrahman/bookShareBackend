const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const Invitation = require("../../models/Invitations");
const Post = require("../../models/Post");

const authentication = require("../../middlewears/auth");

//  POST api/users/register

router.post("/signup", (req, res) => {
  // // Form validation
  // const { errors, isValid } = validateRegisterInput(req.body);
  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = new User(req.body);
    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => res.send(err.message));
      });
    });
  });
});

// POST api/users/login
router.post("/login", (req, res) => {
  // // Form validation
  // const { errors, isValid } = validateLoginInput(req.body);
  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by username
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "No user registed in this mail!" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          email: user.email,
          type: user.type
        };
        // Sign token
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 },
          (err, token) => {
            res.json({
              type: user.type,
              username: user.username,
              token: "Bearer " + token
            });
          }
        );
      }
      else {
        return res.status(400).json({ message: "Password Incorrect!" });
      }
    });
  });
});

// List Users
router.get("/list", (req, res) => {
  User.find()
    .then(data => {
      let userData = data.map(x => {
        delete x.email;
        delete x.password;
        return x;
      })
      res.send(userData);
    })
    .catch(err => console.log(err));
});
router.post("/invitation", authentication, (req, res) => {
  let invitation = new Invitation(req.body);
  invitation.save()
    .then(data => res.json({ "msg": "Invitation Sent" }))
    .catch(err => res.send(err));
});
router.get("/invitation", authentication, (req, res) => {
  Invitation.find({ username: req.user.username })
    .then(inv => {
      if (inv) {
        let postsList = [];
        inv.forEach(x => {
          Post.findById(x.post)
            .then(function (post) {
              postsList.push(post);
              res.json(postsList);
            });
        });
      }
      else res.json(inv);
    })
    .catch(err => res.json(err));
});
module.exports = router;