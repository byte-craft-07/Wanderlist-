const express = require("express");
const passport = require("passport");

const asyncWrape = require("../utils/asyncWrape.js");
const User = require("../models/user.js");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/signup",
  asyncWrape(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash("error", "Password and confirm password must match.");
      return res.redirect("/signup");
    }

    try {
      const newUser = new User({ email, username });
      await User.register(newUser, password);

      req.flash("success", "Welcome to Wanderlist.");
      res.redirect("/listings");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlist.");
    res.redirect("/listings");
  }
);

module.exports = router;
