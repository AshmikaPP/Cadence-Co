const User = require('../model/userModel');
const product = require('../model/productModel');
const admin = require('../model/adminModel');
const category = require('../model/categoryModel');
const cart = require('../model/cartModel');
const Address = require('../model/AddressModel')

const loadcart = async (req,res)=>{
    try {
        let id = req.session.UserId;
        if(id){
            const user = await User.findOne({_id:id});
        }
        if(!user){
            res.redirect('/register')
        }else{
            res.render('cart')
        }

      
    } catch (error) {
        console.log(error.message)
    }
}
const Addcart = async(req,res)=>{
try {
    const {productId,name,price,quatity,category,total} = req.body
    let id = req.session.UserId;
    if(id){
        const user = await User.findOne({ _id:id});
    }
    if(!user){
        res.json({ success:false,message:"User not currently logged in"})
    }else{
        const product = await product.findOne({_id:id});
        const cart = await cart.findOne({_id:id})
    }

} catch (error) {
    console.log(error.message)
}
}



module.exports={
    loadcart ,
    Addcart
}