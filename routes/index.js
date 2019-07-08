const express = require("express");
const router = express.Router();

const passport = require("passport");
const User = require("../models/user");


// HOMEPAGE
router.get("/", function (req, res) {
    res.render("campground/landing");
});

// AUTH
router.get("/register", function (req, res) {
    return res.render("register")
});

router.post("/register", function (req, res) {
    
    const newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        // Allow access if password is correct
        passport.authenticate("local")(req, res, function () {
            req.flash("error", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN ROUTES

router.get("/login", function (req, res) {
    res.render("login", {});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "login"
}), function (req, res) {
    res.render("login")
});

//LOGOUT ROUTES

router.get("/logout", function (req, res) {
    req.logOut();
    req.flash("success", "LOGGED OUT");
    res.redirect("/login");
});

module.exports = router;