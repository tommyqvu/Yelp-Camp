const express = require("express");
const router = express.Router();
const middleware = require("../middleware")

const Campground = require("../models/campground");
const Comment = require("../models/comment");

// INDEX - show all data
router.get("/", function (req, res) {
    Campground.find({}, function (err, allcamps) {
        if (err) {
            console.log(err)
        } else {
            res.render("campground/index", {
                camps: allcamps
            });
        }
    });

});


// Add new data
router.post("/", middleware.isLoggedIn, function (req, res) {
    // Take data from forms
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {
        name: name,
        image: image,
        description: description,
        author: author,
        price: price
    };
    console.log(req.user)
    // Create a new campground in database
    Campground.create(newCampground, function (err, newCamp) {
        if (err) {
            console.log(err)
        } else {
            req.flash("success", "Campground added successfully");
            res.redirect("/campgrounds")
        }
    })
});

// NEW - show form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campground/new")
});

// Show campground
router.get("/:id", function (req, res) {

    // Find camp ground with ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            console.log(err)
        } else {
            res.render("campground/show", {
                camp: foundCamp
            });
        }
    });
});
// EDIT
router.get("/:id/edit", middleware.checkCampOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, camp) {
        res.render("campground/edit", {
            camp: camp
        });
    });
    // res.render("campground/edit", {camp: req.body.camp});

});

// UPDATE

router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function (err, updated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Campground edited successfully");
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});

//DESTROY
router.delete("/:id", middleware.checkCampOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, camp) {
        if (err) {
            console.log(err)
        } else {
            Comment.deleteMany({
                _id: {
                    $in: camp.comments
                }
            }, (err) => {
                if (err) {
                    console.log(err);
                }
                req.flash("success", "Campground removed successfully");
                res.redirect("/campgrounds");
            });
        }
    });
});


module.exports = router;