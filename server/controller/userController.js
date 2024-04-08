const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const OTPP = require('../model/OtpModel');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const Address = require('../model/AddressModel')

// const { EMAIL,PASSWORD } = require('../env')
const product = require('../model/productModel');
const userModel = require('../model/userModel');
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
        const products = await product.find();
        if (req.session.UserId) {
            const user = await userModel.findOne({_id:req.session.UserId});
            res.render('home', {products, user});
        } else {
            res.render('home', {products});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const afterlogin = async (req,res)=>{
    try {
        const products = await product.find();
        if(req.session.UserId) {
            const user = await userModel.findOne({_id:req.session.UserId});
            console.log("sangeeth",user);
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
        const products = await product.find({ is_Listed: true })
        console.log(products)
        res.render('shop', { products })
    } catch (error) {
        console.log(error)
    }
}

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

        res.render('otp')

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
            console.log("1")
            // const passwordMatch = await bcrypt.compare(password, userData.password);
            if (password == userData.password) {
            req.session.UserId = userData._id
                res.redirect('/home');
            } else {
                console.log("Incorrect password ")
                res.render('register', { message: "Password are incorrect" });
            }
        } else {
            res.render('register', { message: 'Email are incorrect' })
        }

    } catch (error) {
        console.log(error)
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
    // console.log

    transporter.sendMail(message);



}

const Otpverify = async (req, res) => {
    try {
        const Otp = req.body.Otp;
        console.log('otpp', Otp)
        console.log("Email", req.session.email)
        // let data = await User.findOne({email:re})

        const Otpverification = await OTPP.findOne({ email: req.session.email });
        console.log("otpss", Otpverification);

        if (Otp == Otpverification.OTP) {

            const user = new User({
                name: req.session.name,
                email: req.session.email,
                mobile: req.session.mobile,
                password: req.session.password,
                conformpassword: req.session.password
            })
           
            user.save()
            // req.session.userId = data._id

            const usersession = await User.findOne({email:req.session.email});
            req.session.userId = usersession._id 

            console.log()

            res.redirect('/');
            await OTPP.deleteMany({})
        } else {

            res.render('otp', { message: "Otp incorrect" });
        }




    } catch (error) {
        console.log(error)



    }
}


// userController.js

const resendotp = async (req, res) => {
    try {
        // Generate a new OTP (you can use your existing OTP generation logic)
        const newOtp = otpgenerator();
        console.log("newOtp", newOtp);
        // Assuming you have stored the user's email in the req.body.email during the initial registration
        const email = req.session.email;
        // console.log(userEmail);

        // Send the new OTP to the user's email (you should have a function for sending emails)
        sendOtp(email, newOtp);
        let otpdata = await OTPP.findOne({ email: email })
        if (otpdata) {
            otpdata.OTP = newOtp;
            otpdata = await otpdata.save();
        }
        else {
            otpdata = new OTPP({
                email: email,
                OTP: newOtp
            })
        }
        console.log(otpdata)

        // Respond with a success message or any relevant data
        res.json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Error in resendotp:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

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
        const userId = req.session.UserId; // assuming this is a valid ObjectId
        const userdata = await User.findOne({ _id: userId });
        console.log("hi asmika", userdata.name);

        const userAddresses = await Address.findOne({ user: userId });
        
      
        res.render("profile", { user: userdata, userAddresses });

    } catch (error) {
        console.log(error.message);
    }
};









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
    Myprofile
}