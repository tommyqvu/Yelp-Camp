const middlewareObj = {};
const Campground = require("../models/campground");
const Comment = require("../models/comment");
/*
middlewareObj.checkCampOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, camp){
            if(err || !camp){
                req.flash("error", "Campground not found")
                res.redirect("/campgrounds");
            } else if (camp.author.id.equals(req.user._id)) {
                    next();
                } else { 
                    req.flash("error", "You don't have permission to to that");
                    res.redirect("back");
                }
            });
        };
};
*/

middlewareObj.checkCampOwnership = function (req, res, next) {
    Campground.findById(req.params.id, function (err, camp) {
        if (err || !camp) {
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            res.redirect('/campgrounds');
        } else if (camp.author.id.equals(req.user._id) /*||req.user.isAdmin*/ ) {
            req.campground = camp;
            next();
        } else {
            req.flash('error', 'You don\'t have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
};

/*middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else { 
                    req.flash("error", "You don't have permission to edit this comment");
                    res.redirect("back");
                }
            }
        });
    } else{
        res.redirect("back");
        req.flash("error", "You need to be logged in to do ut");
    }
};*/

middlewareObj.checkCommentOwnership = function (req, res, next) {
    Comment.findById(req.params.commentId, function (err, comment) {
        if (err || !comment) {
            console.log(err);
            req.flash('error', 'Sorry, that comment does not exist!');
            res.redirect('/campgrounds');
        } else if (comment.author.id.equals(req.user._id) /* || req.user.isAdmin*/ ) {
            next();
        } else {
            req.flash('error', 'You don\'t have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}



middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj