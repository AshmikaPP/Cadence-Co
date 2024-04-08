const Users = require('../model/userModel');

const isLogin = async (req, res, next) => {
    try {
        const user = await Users.findOne({ _id:req.session.UserId});
    console.log("hlo namaste ", user);
        if (!user || user.is_Blocked) {
            req.session.destroy();
            res.redirect("/register");
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.UserId) {
            res.redirect("/home");
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};