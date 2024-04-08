const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    is_Verified:{
        type:Number,
        default:0
    },
    is_Blocked:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('User',userSchema);