const User = require('../model/userModel');
const Product = require('../model/productModel');
const admin = require('../model/adminModel');
const category = require('../model/categoryModel');
const Cart = require('../model/cartModel');
const Address = require('../model/AddressModel')
const Order = require('../model/orderModel')
const loadpayment = async(req,res)=>{
    try {
        const id= req.session.UserId;
        // let cart = await Cart.findOne({user:id})
        const {address,subtotal,payment_method}=req.body
    } catch (error) {
        console.log(error.message)
    }
}

const orderDetails = async(req,res)=>{
    try {
        console.log('id',req.session.UserId);
        const userId = req.session.UserId;
        const orderData = await Order.find({user:userId})
        res.render("orderDetails",{orderData})
    } catch (error) {
        console.log(error.message)
    }
}

const orderView = async (req, res) => {
    try {
        console.log('id:', req.query.id);
        const id = req.query.id;
        const orderDetails = await Order.findOne({ _id: id });
        console.log("Order Details:", orderDetails);
        res.render("orderViewdetails", { orderDetails });
    } catch (error) {
        console.log(error.message);
    }
};






module.exports={
    loadpayment,
    orderDetails,
    orderView,
     
}