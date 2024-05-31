const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    deliveryDetails:{
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        place:{
           type:String,
           require:true
        },
        pin: {
            type: String,
            required: true
        }
    },
    paymentMethod:{
        type:String
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
            },
            image:[{
                type:String,
                required:true
            }]
        }
        
    ],
    subtotal:{
        type:Number,
       
    },
    date: {
        type: Date,
        default: Date.now 
    },
    status:{
        type:String
    },
});

module.exports = mongoose.model('Order',orderSchema);