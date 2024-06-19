const express = require('express')
const user_route = express();
// const jwt = require("jsonwebtoken");

// app.use(express.json())

// const config = require("../config/config");

// user_route.use(jwt({secret:config.jwtSecret}));

const userController = require('../controller/userController')
const userauth = require("../midlewares/usersession")
const addressController = require('../controller/addressController')

const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')
const couponController = require('../controller/couponController')

user_route.set('views','./views/users');


user_route.get('/',userController.home)

user_route.get('/shop',userController.LoadShop)


user_route.get('/register',userController.loadregister)

user_route.post('/register',userController.userregister)
 
user_route.post('/loginverification',userController.verifyLogin)
 

user_route.post('/otp',userController.Otpverify)

// user_route.post('/resend',userController.resendotp)

user_route.get('/singleproduct/:ProductId',userController.singleproductdetails)

user_route.get('/home',userauth.isLogin,userController.afterlogin)

user_route.get('/logout',userController.logout)

user_route.get('/profile',userauth.isLogin,userController.Myprofile)

user_route.post('/addaddress',addressController.useraddress)

user_route.get('/editaddress',addressController.Editaddress)

user_route.get('/deleteaddress', addressController.deleteaddress);

user_route.get('/cart',cartController.loadcart)

user_route.post('/Add-to-cart',cartController.Addcart)

user_route.post('/updateQuantity',cartController.updateQuantity)

user_route.get('/deletecart',cartController.deletecart)

user_route.post('/profile',userController.EditProfile)

user_route.post('/editaddress',addressController.Editaddress)

user_route.get('/loadeditaddress',addressController.loadedit)

user_route.get('/checkout',userauth.isLogin,cartController.Loadcheckout)

user_route.post('/apply-coupon',couponController.applyCoupon)

user_route.get('/forgotemail',userController.forgotpassword)

user_route.post('/forgotemail',userController.forgotverify)
user_route.get('/forgotpassword',userController.tokenGenarator)

user_route.post('/forgotpassword',userController.verifyEmail)

user_route.post('/resendotp',userController.resendotp)

user_route.post('/placeOrder',cartController.placeOrder)

user_route.get('/orderPlaced',cartController.orderPlaced)

user_route.get('/orderDetails',orderController.orderDetails)

user_route.get('/orderView',orderController.orderView)

user_route.get('/wishlist',userauth.isLogin,cartController.getWishlist)
user_route.post('/wishlist',userauth.isLogin,cartController.addTowishlist)

user_route.get('/remove',cartController.removeWishlist)

// user_route.post('/addaddress',cartController.checkoutaddaddress)

user_route.post('/checkoutaddaddress',cartController.checkoutaddaddress)

user_route.get('/loadcheckouteditaddress',cartController.loadcheckouteditaddress)

user_route.post('/checkouteditaddress',cartController.checkoutEditaddress)

user_route.post('/changeOrderstatus',userController.changeOrderstatus)

user_route.post('/verifypayment',cartController.verifyPayment)

user_route.get('/invoice',userController.invoiceDownload)

user_route.post('/payOrder',cartController.payOrder)








module.exports = user_route