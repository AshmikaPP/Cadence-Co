const Cart = require("../model/cartModel");
const Coupon = require("../model/couponModel")


const loadCoupon = async(req,res)=>{
    try {
        const coupon = await Coupon.find({})
        res.render("coupon",{coupon})
    } catch (error) {
        console.log(error.message);
    }
}

const loadaddCoupon = async(req,res)=>{
    try {
        res.render("addCoupon")
    } catch (error) {
        console.log(error.message)
    }
}

const addCoupon = async(req,res)=>{
    try {
        const coupondata = await Coupon.findOne({
            couponcode:req.body.couponcode,
        });
        if(coupondata){
        return res.render("addCoupon",{message:"couponcode already exists"});
        }else{
            console.log("nameeeeeeeeeeeee",req.body.name);
            const data = new Coupon({
                name:req.body.name,
                couponcode:req.body. couponcode,
                discountamount:req.body.discountamount,
                activateDate:req.body.activateDate,
                expiryDate:req.body.expiryDate,
                criteriaamount:req.body.criteriaamount,
            });

            await data.save();
            return res.redirect("/loadCoupon");
        }
    } catch (error) {
        console.log(error.message)
    }
}

const deleteCoupon = async(req,res)=>{
    try {
        const id = req.query.id;
        const deletecoupon = await Coupon.deleteOne({_id:id})
        res.redirect("/loadCoupon")
    } catch (error) {
        console.log(error,message)
    }
}

const applyCoupon = async (req, res) => {
    try {
        const userId = req.session.UserId;
        const couponCode = req.body.couponCode;

        // Check if the coupon is already applied in the session
        if (req.session.couponCode === couponCode) {
            return res.status(400).json({ success: false, message: "Coupon already applied." });
        }

        // Find the coupon by coupon code
        const couponData = await Coupon.findOne({ couponcode: couponCode });

        if (!couponData) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }

        // Check if the user has already used this coupon
        if (couponData.useduser.includes(userId)) {
            return res.status(400).json({ success: false, message: "Coupon already used by this user." });
        }

        
        // Save the coupon code in the session
        req.session.couponCode = couponCode;

        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully.",
            couponName: couponData.name,
            discountAmount: couponData.discountamount
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};



module.exports={
    loadCoupon,
    loadaddCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon
}