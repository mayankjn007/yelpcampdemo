
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj={};

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","You have to LogIn First..!!");
        res.redirect("/login");
    }
        
};

middlewareObj.checkCampgroundOwnership=function(req,res,next) {
    if(req.isAuthenticated()){
      Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not Found");
            res.redirect("back");
        }
        else{
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                    res.redirect("back");
                    req.flash("error","You dont have permission to do that");
                }
            }
        });   
    }
    else{
        req.flash("error","You need to LogIn First");
        res.redirect("back");
    }
};
middlewareObj.checkCommentOwnership=function(req,res,next) {
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err || !foundComment){
         req.flash("error","comment not found");
         res.redirect("back");
        }
        else{
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error","You dont have permission to do that");
                res.redirect("back");
            }
                
            }
        });   
    }
    else{
        req.flash("error","You have to LogIn First..!!");
        res.redirect("back");
    }
};

module.exports = middlewareObj;