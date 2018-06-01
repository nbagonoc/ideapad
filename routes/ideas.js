// bring in express
const express = require("express");
// bring in Express Router
const router = express.Router();
// bring in mongoose
const mongoose = require("mongoose");
// bring in auth helper
const { ensureAuthenticated } = require("../helpers/auth");

// load Idea Model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// add idea route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// add idea process form
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.idea) {
    errors.push({ text: "Please enter your idea" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please include a description" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      idea: req.body.idea,
      details: req.body.details
    });
  } else {
    const newIdea = {
      idea: req.body.idea,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newIdea).save().then(idea => {
      // flash message
      req.flash("success_message", "idea saved");
      res.redirect("/ideas");
    });
  }
});

// ideas page, fetching result
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(data => {
      res.render("ideas", {
        data: data
      });
    });
});

// edit route
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(data => {
    if (data.user != req.user.id) {
      req.flash("error_message", "not authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        data: data
      });
    }
  });
});

// edit idea form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(data => {
    // new values
    (data.idea = req.body.idea),
      (data.details = req.body.details),
      data.save().then(data => {
        // flash message
        req.flash("success_message", "idea updated");
        res.redirect("/ideas");
      });
  });
});

// delete idea process
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    // flash message
    req.flash("success_message", "idea removed");
    res.redirect("/ideas");
  });
});

module.exports = router;
