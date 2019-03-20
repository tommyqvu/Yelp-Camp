const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require("method-override")
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");

const commentRoutes = require("./routes/comments");
const campgroundsRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/index");

// Local
/*mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true
}); */

/*
// Heroku
mongoose.connect(`mongodb+srv://tommy:tommy1998@cluster0-asjlb.mongodb.net/test?retryWrites=true
`);
*/

mongoose.connect(process.env.DATABASEURL);

console.log(process.env.DATABASEURL)


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())
app.use(require("express-session")({
    secret: "666",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
//serializeUser determines which data of the user object should be stored in the session
passport.serializeUser(User.serializeUser());
//The first argument of deserializeUser corresponds to the key of the user object that was given to the done function
passport.deserializeUser(User.deserializeUser());
// Passes currentUser and message to all templates
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use(authRoutes);




//Show uploads by user
app.get("/mycamps", function (req, res) {
    Campground.find({"author.id": req.user._id}, function(err, camps){
        res.render("campground/mycamps", {camps: camps});

    });
});

const port = process.env.PORT || 8080;
const ip = process.env.IP || "localhost";

app.listen(port ,function(){
    console.log("Server has started");
});