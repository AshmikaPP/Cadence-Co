const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_Listed:{
        type:Boolean,
        default:true
    },
//     categoryoffer:{
//         type:Number,
//         default:0
//    },
//    is_offerapply:{
//     type:Boolean,
//     default:false
//  },
 offers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'offers', 
  }],
});
module.exports = mongoose.model('category',categorySchema);

