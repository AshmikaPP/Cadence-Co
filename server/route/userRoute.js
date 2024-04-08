const express = require('express')
const user_route = express();
// const jwt = require("jsonwebtoken");

// app.use(express.json())

// const config = require("../config/config");

// user_route.use(jwt({secret:config.jwtSecret}));

const userController = require('../controller/userController')
const userauth = require("../midlewares/usersession")
const addressController = require('../controller/addressController')


user_route.set('views','./views/users');


user_route.get('/',userController.home)

user_route.get('/shop',userController.LoadShop)

user_route.get('/register',userController.loadregister)

user_route.post('/register',userController.userregister)
 
user_route.post('/loginverification',userController.verifyLogin)
 

user_route.post('/otp',userController.  Otpverify)

user_route.post('/resend',userController.resendotp)

user_route.get('/singleproduct/:ProductId',userController.singleproductdetails)

user_route.get('/home',userauth.isLogin,userController.afterlogin)

user_route.get('/logout',userController.logout)

user_route.get('/profile',userauth.isLogin,userController.Myprofile)

user_route.post('/addaddress',addressController.useraddress)

user_route.get('/editaddress',addressController.Editaddress)





module.exports = user_route