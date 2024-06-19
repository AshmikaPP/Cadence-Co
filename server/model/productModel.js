const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
   
    stock:{ 
        type:Number,  
        require:true
    },
    category:{ 
            type: mongoose.Types.ObjectId,
            ref: "category",
            required: true
             
    },
    is_Listed:{
        type:Boolean,
        default:true
    },
    productoffer:{
         type:Number,
         default:0
    },
    // is_offerapply:{
    //    type:Boolean,
    //    default:false
    // },
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'offers', 
      }],
        image:[{
            type:String,
            required:true
        }]

});
module.exports = mongoose.model('product',productSchema)