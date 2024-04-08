const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema({
    OTP:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    // password:{
    //     type:String,
    //     require:true
    // },
    createdAt:{
        type:Date,
        default:Date.now

    },
    expires:{
        type:Date,
        default:Date.now()+60000*1,
        expires:'5m'

    }
});
module.exports = mongoose.model('Otp',OtpSchema);

