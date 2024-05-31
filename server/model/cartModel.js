const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    product: [
        {
            product_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                default:0,
            },
            quantity:{
                type:Number,
                default:1,
            },
            category:{
                type:String,
                required:true
            },
            total:{
                type:Number,
                default:0
            }
        }
        
    ],
    subtotal:{
        type:Number,
        default:true
    }

})
module.exports = mongoose.model('Cart',cartSchema);