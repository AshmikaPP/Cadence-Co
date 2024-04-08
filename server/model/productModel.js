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
        type:String,
        require:true
    },
   
    stock:{ 
        type:String,  
        require:true
    },
    category:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
             
    },
    is_Listed:{
        type:Boolean,
        default:true
    },
        image:[{
            type:String,
            required:true
        }]
});
module.exports = mongoose.model('product',productSchema)