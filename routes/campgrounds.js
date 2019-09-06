var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/",function(req,res){
    res.render("landing");
});

router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err)
            console.log(err);
        else
            res.render("campgrounds/index",{ campgrounds:allCampgrounds,page:"campgrounds"});
    });
});
router.get("/campgrounds/new",middleware.isLoggedIn,function(req, res) {
   res.render("campgrounds/new"); 
});
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var price = req.body.price;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCampground = {name:name, image:image, description:desc,author:author,price:price};
    Campground.create(newCampground,function(err,NewlyCreated){
        if(err)
            console.log(err);
        else
            res.redirect("/campgrounds");
    });
});
router.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground)
           {
               req.flash("error","Campground not found");
               res.redirect("/campgrounds");
           }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

//EDIT AND UPDATE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    if(req.isAuthenticated()){
      Campground.findById(req.params.id,function(err,foundCampground){
                res.render("campgrounds/edit",{campground:foundCampground});
        });   
    }
});
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
            console.log(err);
            res.redirect("/campgrounds");
    }
    else
        res.redirect("/campgrounds/"+ req.params.id);
   }); 
});

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err)
            res.redirect("/campgrounds");
       else
            res.redirect("/campgrounds");
   });
});


module.exports = router;