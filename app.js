//SETUP
var express = require("express");
var app = express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStratergy = require("passport-local");
var Campground = require("./models/campground");        
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds.js");
var methodOverride = require("method-override");
var flash = require("connect-flash");

//===================REQUIRE ROUTES FILE========================
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
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
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server Started"); 
});


