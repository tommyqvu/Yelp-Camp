const express = require("express");
const router = express.Router({
    mergeParams: true
});
const middleware = require("../middleware")

const Campground = require("../models/campground");
const Comment = require("../models/comment");

// New comment form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    // Find campground
    Campground.findById(req.params.id, function (err, camp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: camp
            });
        }
    });
});

//Submit comments
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, camp) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("error", "Comment added successfully");
                    res.redirect("/campgrounds/" + camp._id);
                }
            })
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    
    Comment.findById(req.params.comment_id, function (err, comment) {
        if (err) {
            console.log(err)
        } else {

            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: comment
            })
        };
    });

});
// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Comment edited successfully");
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, camp) {
        if (err) {
            console.log(err)
        } else {
            req.flash("success", "Comment edited successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;