// bring in express
const express = require("express");
// bring in Express Router
const router = express.Router();
// bring in mongoose
const mongoose = require("mongoose");
// bring in bcrypt
const bcrypt = require("bcryptjs");
// bring in passport
const passport = require("passport");

// bring in user model
require("../models/User");
const User = mongoose.model("users");

// user login
router.get("/login", (req, res) => {
  res.render("users/login");
});

// user register
router.get("/register", (req, res) => {
  res.render("users/register");
});

// user register process
router.post("/register", (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({ text: "Please provide your name" });
  }
  if (req.body.email == "") {
    errors.push({ text: "Please provide an email" });
  }
  if (req.body.password != req.body.confirmPassword) {
    errors.push({ text: "Password does not match" });
  }
  if (req.body.password.length < 6) {
    errors.push({ text: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_message", "Email already exist");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_message",
                  "You are now registered, and can now login"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// user login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// user logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_message", "You are now logged out");
  res.redirect("/users/login");
});

module.exports = router;
