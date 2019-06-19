var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var passport = require("passport");
var User = require("../models/user")
router.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});

//===============AUTH ROUTES===========================

router.get("/register",function(req, res) {
   res.render("register",{page:'register'}); 
});

router.post("/register",function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
       passport.authenticate("local")(req,res,function(){
           req.flash("success","Welcome to Yelpcamp" + user.username);
          res.redirect("/campgrounds"); 
       });
    });
});

router.get("/login",function(req, res){
   res.render("login",{page:'login'}); 
});

router.post("/login",passport.authenticate("local",
    {
     successRedirect: "/campgrounds",
     failureRedirect: "/login"
    }),
function(req, res) {});


router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","Logged You OUT");
   res.redirect("/campgrounds");
});


module.exports = router;