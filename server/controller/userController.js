const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const OTPP = require('../model/OtpModel');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const Address = require('../model/AddressModel')
const category = require('../model/categoryModel')
// const { EMAIL,PASSWORD } = require('../env')
const product = require('../model/productModel');
const userModel = require('../model/userModel');
const randomstring = require("randomstring");
const Order = require('../model/orderModel')
const securePassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);

    }

}

const home = async (req, res) => {
    try {
      
        const products = await product.find().populate('category');
        if (req.session.UserId) {
            const user = await userModel.findOne({_id:req.session.UserId});

            res.render('home', { products, user });
        } else {
            res.render('home', { products });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error');
    }
};

const afterlogin = async (req,res)=>{
    try {
        const products = await product.find();
        if(req.session.UserId) {
            const user = await userModel.findOne({_id:req.session.UserId});
            // console.log("sangeeth",user);
            res.render('home',{products, user})
        } else {
            res.redirect('/register')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req,res)=>{
    try {
       req.session.destroy()
       res.redirect('/')

    } catch (error) {
        console.log(error.message)
    }
}

const LoadShop = async (req, res) => {
    try {
        const CategoryData = await category.find();
        let query = { is_Listed: true };
        

        let sortOption = {};
        switch (req.query.sort) {
            case "3": 
                sortOption = { name: 1 };
                break;
            case "4": 
                sortOption = { name: -1 };
                break;
            case "5": 
                sortOption = { price: 1 };
                break;
            case "6": 
                sortOption = { price: -1 };
                break;
            default:
               
                break;
        }
  
        
        if (req.query.category) {
            query.category = req.query.category;
        }
  
      
        const searchQuery = req.query.search;
        if (searchQuery) {
            query.name = { $regex: new RegExp(searchQuery, 'i') };
        }
  
      
        const products = await product.find(query).populate('category').sort(sortOption);
  
        res.render('shop', { products, CategoryData, searchQuery });
    } catch (error) {
        console.log(error);
    }
};




const loadregister = async (req, res) => {
    try {
        res.render('register')
    } catch (error) {
        console.log(error)

    }
}


function otpgenerator() {
    return Math.floor(1000 + Math.random() * 9000);
}

const userregister = async (req, res) => {
    try {

        const { name, email, mobile, password, conformpassword } = req.body
        // if(!name || !mobile){
        //     return res.render('register')
        // }
        console.log('1')


        const spassword = await securePassword(req.body.password);
        

        console.log("Register email", req.session.email)
         req.session.email = email
        const user = new User({
            name: name,
            email: email,
            mobile: mobile,
             password: spassword,
            conformpassword: spassword
        })
        console.log("userdata:", user);

        const Otp = otpgenerator();
        sendOtp(email, Otp)
        console.log('email', email);
        console.log('Otp', Otp)
        user.save();

        const Otpcollecti = new OTPP({
            OTP: Otp,
            email: email


        })
        console.log('Otpcollection', Otpcollecti)

        await Otpcollecti.save();

        res.render('otp', { email });

    } catch (error) {
        console.log(error)

    }
}

    const verifyLogin = async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const userData = await User.findOne({ email: email });

            if (userData) {
            
                const passwordMatch = await bcrypt.compare(password, userData.password);
                if (passwordMatch) {
                    req.session.UserId = userData._id;
                    res.redirect('/home');
                } else {
                    console.log("Incorrect password");
                    res.render('login', { message: "Incorrect password" });
                }
            } else {
                console.log("User not found");
                res.render('login', { message: 'Email not found' });
            }
        } catch (error) {
            console.log(error);
            res.render('error', { message: 'An error occurred' });
        }
    }



    function sendOtp(email, Otp) {
        // console.log("otp")
        // console.log("Sendotp")
        let config = {
            service: 'gmail',
            auth: {
                user: 'ashmikapp2002@gmail.com',
                pass: 'uxlcvngachkplerc'
            }
        }

        // console.log(PASSWORD)
        // console.log("Otp1")
        let transporter = nodemailer.createTransport(config)

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: 'http://mailgen.js/'
            }
        })
        // console.log("Otp2")

        let response = {
            body: {
                name: email,
                intro: `Your OTP is ${Otp}`,
                outro: "Thank you"
            }
        };
        // console.log("12")
        // console.log(response)

        let mail = MailGenerator.generate(response)

        let message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Otp sent successfully',
            html: mail
        };
        
        transporter.sendMail(message);



    }

    // reset email


    

    const Otpverify = async (req, res) => {
        try {
            const Otp = req.body.Otp;
        
            let email=req.body.email

            const Otpverification = await OTPP.findOne({ email: req.body.email });

            
            if (Otp == Otpverification.OTP) {
                const userid = await User.updateOne({ email: req.body.email }, { is_Verified: 1 });

                console.log(userid,"whfwdiuwbhdwiduwdi  ")

                const usersession = await User.findOne({email:req.body.email});
                req.session.userId = usersession._id 

                console.log()

                res.redirect('/');
                await OTPP.deleteMany({})
            } else {

                res.render('otp', { message: "Otp incorrect" },{email});
            }




        } catch (error) {
            console.log(error)



        }
    }

const forgotpassword = async (req,res) =>{
    try {
        
        
        res.render("forgotemail")
    } catch (error) {
        console.log(error.message)
    }
}

const forgotverify = async(req,res)=>{
    try {
        console.log("geywgfhwjff");

        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
             
             if(userData.is_Verified === 0){
                res.render('forgotemail',{message:"Please verify your mail"});
             }else{
                const randomString = randomstring.generate();
                const updatedData = await User.updateOne({email:email},{$set:{ token:randomString}});
                sendforgetemail(userData.name,userData.email,randomString)
                console.log("geywgfhwjff");
                res.render('forgotemail',{message:"Please check your mail"});

             }
        }else{
            res.render('forgotemail',{message:"User email is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}




const sendforgetemail = async (name, email, token) => {
    try {
        console.log(email);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ashmikapp2002@gmail.com',
                pass: 'uxlcvngachkplerc'
            }
        });

        console.log("abin");

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "For Reset Password",
            html: '<p>Hii ' + name + ', please click here to <a href="http://127.0.1:3000/forgotpassword?token=' + token + '">Reset</a> your password.</p>',
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

const tokenGenarator = async(req,res)=>{
    const token = req.query.token
    const userData = await User.findOne({token:token})
    if(userData){
        res.render("forgotpassword",{userData})
    }else{
        res.redirect('/forgotemail')
    }
    console.log(token);
}

const verifyEmail = async(req,res)=>{
    try {
        const password = req.body.password
        console.log("password may",password);
        const conformpassword = req.body.confirm_password
        console.log(conformpassword);
        const UserId= req.body.userId
        console.log(UserId);
        if(password==conformpassword &&  UserId){
            const secure_password = await securePassword(password)
            const updatedpassword = await User.findByIdAndUpdate({_id:UserId},{$set:{password:secure_password}})
            res.redirect('/register')
        }else{
            res.render("forgotpassword", { message: "Password does not match", userData: {} });

        }
    } catch (error) {
        console.log(error.message)
    }
}
// userController.js

// const resendotp = async (req, res) => {
//     try {
        
//         const newOtp = otpgenerator();
//         console.log("newOtp", newOtp);
//         console.log('email',email);
//         const email = req.session.email;

//         sendOtp(email, newOtp);
//         let otpdata = await OTPP.findOne({ email: email })
//         if (otpdata) {
//             otpdata.OTP = newOtp;
//             otpdata = await otpdata.save();
//         }
//         else {
//             otpdata = new OTPP({
//                 email: email,
//                 OTP: newOtp
//             })
//         }
//         console.log(otpdata)

//         res.json({ success: true, message: 'OTP resent successfully' });
//     } catch (error) {
//         console.error('Error in resendotp:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };
// ---------------------------------------------------------------------------------------------------------
const resendotp = async (req, res) => {
    try {
        const email = req.body.email;
        const newOtp = Math.floor(1000 + Math.random() * 9000);
        await sendOtp(email, newOtp);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
// ----------------------------------------------------------------------------------------------------------------

const singleproductdetails = async (req, res) => {
    try {

        const productid = req.params.ProductId
        

        const Product = await product.findOne({ _id: productid })
       
        res.render('singleproduct', { Product })


    } catch (error) {
        console.log(error.message);

    }
}

const Myprofile = async(req, res) => {
    try {
        console.log("id of asmika", req.session.UserId);
        const userId = req.session.UserId;
        const userdata = await User.findOne({ _id: userId });
        console.log("hi asmika", userdata.name);

        const userAddresses = await Address.findOne({ user: userId });

        const orderData = await Order.find({user:userId})
      
        res.render("profile", { user: userdata, userAddresses,orderData  });

    } catch (error) {
        console.log(error.message);
    }
};

const EditProfile = async (req, res) => {
    try {
        const userId = req.session.UserId; 
        const { name, email } = req.body;


        await User.findByIdAndUpdate(userId, { name }, { new: true });

        
        res.redirect('/profile');
    } catch (error) {
        console.log(error.message)
    }
}

const changeOrderstatus = async(req,res)=>{
    try {
        const userId = req.session.UserId
        console.log('orderId',req.query);
        const orders = await Order.findById({_id:req.query.orderId });
        console.log(orders.paymentMethod,"888888888888888888888")
        console.log(orders.status,"2222222222");
        if (orders.paymentMethod == "wallet" || orders.paymentMethod == "cheque" || orders.status == "Delivered") {
            const userData = await User.findByIdAndUpdate(
                { _id: req.session.UserId }, 
                { $inc: { wallet: orders.subtotal } },
                { new: true } 
            );
            const user = User.findById(userId)
            user.walletHistory.push({
                date:orders.date,
                amount:orders.subtotal,
                discription:"Amount credited for cancel order"
            })
        }
        
        const orderStatus = await Order.findByIdAndUpdate(
            { _id: req.query.orderId }, 
        { status: req.query.status }, 
        { new: true } 
    );
    res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
}







module.exports = {
    home,
    loadregister,
    userregister,
    verifyLogin,
    Otpverify,
    resendotp,
    LoadShop,
    singleproductdetails,
    afterlogin,
    logout ,
    Myprofile,
    EditProfile,
    forgotpassword,
    forgotverify,
    sendforgetemail,
    tokenGenarator,
    verifyEmail,
    changeOrderstatus

}