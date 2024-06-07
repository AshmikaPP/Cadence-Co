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
const {generateReferralCode} = require('../utilis/refreal')









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
  
        const pageSize = 6; // Number of products per page
        const currentPage = parseInt(req.query.page) || 1;
        const totalProducts = await product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / pageSize);
        const skip = (currentPage - 1) * pageSize;
        
        const products = await product.find(query)
            .populate('category')
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize);
  
        res.render('shop', { products, CategoryData, searchQuery, currentPage, totalPages });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
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
        const { name, email, mobile, password, conformpassword, referralCode } = req.body;
        const referralCodeuser = generateReferralCode();
        console.log('1');

        const userData = await User.findOne({ email });

        if (userData) {
            if (userData.is_Verified === 0) {
                return res.render('register', { message: "User is not verified" });
            }
            return res.render('register', { message: "User already exists" });
        }

        if (password !== conformpassword) {
            return res.render('register', { message: 'Passwords do not match' });
        }

        let referedBy = null;

        if (referralCode) {
            referedBy = await User.findOne({ referralCode });

            if (!referedBy) {
                return res.render('register', { message: "Invalid referral code" });
            }
        }

        const spassword = await securePassword(password);

        const user = new User({
            name,
            email,
            mobile,
            password: spassword,
            conformpassword: spassword,
            referralCode: referralCodeuser,
            referredBy: referedBy ? referedBy._id : null,
            wallet: 50 // Add welcome bonus to new user's wallet
        });

        console.log("userdata:", user);
        await user.save();

        if (referedBy) {
            referedBy.wallet += 100; // Add referral bonus to referrer's wallet
            await referedBy.save();
        }

        const Otp = otpgenerator();
        req.session.email = email;

        sendOtp(email, Otp);
        console.log('email', email);
        console.log('Otp', Otp);

        const Otpcollecti = new OTPP({
            OTP: Otp,
            email: email
        });

        console.log('Otpcollection', Otpcollecti);
        await Otpcollecti.save();

        console.log("22222222222222222222222222222222222222222222222222", email);
        res.render('otp', { email });

    } catch (error) {
        console.log(error);
        res.status(500).render('register', { message: 'An error occurred during registration' });
    }
};


  

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
        console.log("otp",Otp)

        console.log("Sendotp",email)
        let config = {
            service: 'gmail',
            auth: {
                user: 'skycrowlove@gmail.com',
                pass: 'rete eeaa kcdk pbwm'
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
            console.log("11111111111111111111111",req.body);
            let email=req.body.email

            const Otpverification = await OTPP.findOne({ email: req.body.email });
            console.log("33333333333333333333333333333333",Otpverification);
            
            if (Otp == Otpverification.OTP) {
                console.log("hello");
                const userid = await User.updateOne({ email: req.body.email }, { is_Verified: 1 });

                console.log(userid,"whfwdiuwbhdwiduwdi  ")

                const usersession = await User.findOne({email:req.body.email});
                req.session.userId = usersession._id 

                console.log()

                res.redirect('/');
                await OTPP.deleteMany({})
            } else {
                console.log('hai');
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


// ---------------------------------------------------------------------------------------------------------
const resendotp = async (req, res) => {
    try {
        const email = req.body.email;
        const newOtp = Math.floor(1000 + Math.random() * 9000);

        
        await sendOtp(email, newOtp);
        const otpDocument = await OTPP.findOneAndUpdate(
            { email: email },       
            { OTP: newOtp },        
            { new: true, upsert: true } 
        );

        console.log('Updated Otp Document', otpDocument);

        console.log("Updated OTP and sent email");

        res.sendStatus(200);
    } catch (error) {
        console.log("Error while resending OTP");
        console.error(error);
        
        res.sendStatus(500);
    }
};

// ----------------------------------------------------------------------------------------------------------------

const singleproductdetails = async (req, res) => {
    try {


        const productid = req.params.ProductId
        

        const Product = await product.findOne({ _id: productid }).populate('category')
       
        res.render('singleproduct', { Product  })


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

        const orderData = await Order.find({user:userId}).sort({ date: -1 });
      
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
        const userId = req.session.UserId;
        console.log('orderId', req.body);
        const orders = await Order.findById(req.body.orderId);
        const Status = req.body.status;
        const reason = req.body.reason;
        console.log(Status,"111111111111111111111111111111111111111111111111111111111111111111111111111");
        if(Status == 'Pending Return'){
            orders.returnReason = reason;
        }
        await orders.save();
        console.log(orders.paymentMethod, "888888888888888888888");
        console.log(orders.status, "2222222222");
        if (orders.paymentMethod == "wallet" || orders.paymentMethod == "cheque" || orders.status == "Delivered") {
            const userData = await User.findByIdAndUpdate(
                { _id: req.session.UserId }, 
                { $inc: { wallet: orders.subtotal } },
                { new: true } 
            );
            const user = await User.findById(userId);
            
            user.walletHistory.push({
                date: orders.date,
                amount: orders.subtotal,
                description: "Amount credited for cancel order"
            });
            
            await user.save();
        }
        
        const orderStatus = await Order.findByIdAndUpdate(
            { _id: req.body.orderId }, 
            { status: req.body.status }, 
            { new: true } 
        );

        res.status(200).json({ message: 'Order status updated successfully', orderStatus });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
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
    changeOrderstatus,

}