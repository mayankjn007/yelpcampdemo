var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
        name : "Rishikesh",
        image : "https://ihplb.b-cdn.net/wp-content/uploads/2014/06/Camping-in-Rishikesh.jpg",
        description: "Situated in the lap of the Great Himalayas, Rishikesh is a major pilgrim destination for Hindus. It is one of the most sought after camping destinations in India and a popular Indian pilgrimage destination. One can go for rafting and can try hands at other adventure sports. It too attracts people from all over the world."
    },
    {
        name : "Jaisalmer",
        image : "https://ihplb.b-cdn.net/wp-content/uploads/2014/06/Camping-in-Jaisalmer.jpg",
        description: "Nestled in the Keylong district of Himachal Pradesh, Spiti Valley is one of the desired camping sites for adventure enthusiasts and trekkers. It is an ideal place for camping in summers, to get respite from the hot sun. May and June are the perfect months to enjoy the natural setting of the valley."
    },
    {
        name : "Split Valley",
        image : "https://ihplb.b-cdn.net/wp-content/uploads/2014/06/Camping-in-Rishikesh.jpg",
        description: "Situated in the lap of the Great Himalayas, Rishikesh is a major pilgrim destination for Hindus. It is one of the most sought after camping destinations in India and a popular Indian pilgrimage destination. One can go for rafting and can try hands at other adventure sports. It too attracts people from all over the world."
    }
    ];

function seedDB()
{
    Campground.deleteMany({},function(err){
    if(err)
        console.log(err);
    else
        console.log("Remove Campgrounds");
        
    data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err)
                    console.log(err);
                else
                    console.log("Campground Added");
                    Comment.create({text:"Incredible India",author:"A person"},function(err,comment){
                      if(err)
                            console.log(err);
                        else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Comment Created");
                        }
                    });
            });
        });
     });    
}
module.exports = seedDB;
