const mongoose = require("mongoose");

const commentSchema =new mongoose.Schema({
    text: String,
    author: {
        id :{
            type : mongoose.Schema.Types.ObjectId,
            ref  : "User"
        },
        username: String
    } 
});
module.exports = new mongoose.model("Comment",commentSchema);
