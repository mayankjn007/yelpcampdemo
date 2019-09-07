//SETUP
const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStratergy = require("passport-local");
const Campground = require("./models/campground");        
const Comment = require("./models/comment");
const User = require("./models/user");
// const seedDB = require("./seeds.js");
const methodOverride = require("method-override");
const flash = require("connect-flash");

//===================REQUIRE ROUTES FILE========================
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");
//==============================================================

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(flash());
// seedDB();
//======PASSPORT CONFIG========================================
app.use(require("express-session")({
    secret: "Thoda sa samjhmein aana lga hai",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=============================================================
app.use((req,res,next) => {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT,() => {
   console.log("Server Started"); 
});


