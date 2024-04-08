const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin == null) {
            res.redirect("/admin/login");
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};


const isLogin = async (req, res, next) => {
    try {
        if (!req.session.admin) {
            //   console.log("mreq.session.admin);
            next();
        } else {
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    isLogout,
    isLogin
}