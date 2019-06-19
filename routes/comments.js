var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//===============COMMENT ROUTES===========================

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err)
            console.log(err);
        else
           res.render("comments/new",{campground:campground}); 
    });
});
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err, campground) {
      if(err)
            console.log(err);
    else{
            Comment.create(req.body.comment,function(err,comment){
               if(err){
                    req.flash("error","Something Went Wrong");
                    console.log(err);
               }
                else{
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment Added Successfully");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
   }); 
});

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err, foundCampground) {
       if(err || !foundCampground){
           req.flash("error","Campground not found");
           return res.redirect("back");
       }
        Comment.findById(req.params.comment_id,function(err, foundComment) {
           if(err)
                res.redirect("back");
            else
                res.render("comments/edit",{campground_id : req.params.id,comment:foundComment});
        });
    });
});

router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
      if(err)
        res.redirect("back");
      else
        res.redirect("/campgrounds/" + req.params.id);
   }); 
});

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
      if(err)
            res.redirect("back");
      else{
          req.flash("success","Comment Deleted");
            res.redirect("/campgrounds/"+ req.params.id);  
      }
   }); 
});


module.exports = router;