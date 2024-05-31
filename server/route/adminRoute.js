const express = require('express')
const admin_route = express()
admin_route.use(express.json())
admin_route.use(express.urlencoded({ extended: true }));
// const upload = require('../../midlewares/upload');

const adminController = require('../controller/adminController')
const couponController = require('../controller/couponController')
const offerController = require('../controller/offerController')
const Auth = require('../midlewares/adminsession')


admin_route.set('views','./views/admin');

// admin_route.get('/',adminController.home)


  

const multer = require("multer");
const path = require("path");
const { exists } = require('../model/productModel');

admin_route.use(express.static('public'));

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,'../public/upiImage'),function(error,success){
//             if(error) throw error
//         });
//     },
//     filename:function(req,file,cb){
//         const name = Date.now()+'_'+file.originalname;
//         cb(null, name, function(error1, success1){
//             if(error1) throw error1
//         })
//     }
// });
const fs=require('fs')

const uploadDir=path.join(__dirname,'../uploads/product')
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,uploadDir)
    },
    filename:function(req,file,cb){
        console.log(file)
        // const name= Date.now()+'-'+file.originalname;
        // cb(null,name,function(error1,success1){
        //     if(error1) throw error1
        // })
        cb(null,Date.now()+path.extname(file.originalname))
        // console.log("hello")
    }
       
})

const upload = multer({storage:storage,array:'image'});











admin_route.get('/admin/login',Auth.isLogin,adminController.loadLogin)
admin_route.get('/dashboard',Auth.isLogout,adminController.Dashboard)

admin_route.post('/loginpage',adminController.verifyLogin)

admin_route.get('/LoadCategory',Auth.isLogout,adminController.LoadCategory)

admin_route.get('/AddCategory',adminController. AddCategoty)
admin_route.post('/AddCategory',adminController.postcategory)
admin_route.get('/deletecategory',adminController.deletecategory)

admin_route.get('/Unlistcategory',adminController.Unlistcategory)
admin_route.get('/listcategory',adminController.listcategory)
admin_route.get('/loaduser',Auth.isLogout,adminController.LoadUsers)
admin_route.get('/blockuser',adminController.blockusers)
admin_route.get('/unblockuser',adminController.UnBlock)
admin_route.get('/loadedit',adminController.LoadEdit)
admin_route.post('/loadedit',adminController. posteditcategory)
admin_route.get('/loadproduct',Auth.isLogout,adminController.Loadproduct)
admin_route.get('/AddProduct',adminController.LoadAddProduct)
admin_route.post('/Addproduct',upload.array('image'),adminController.Addproduct);
// admin_route.post('/AddProduct',adminController.Loadproduct)
admin_route.post('/AddProduct',adminController.Addproduct)
admin_route.get('/Unlistproduct',adminController.Unlistproduct)
admin_route.get('/listproduct',adminController.listproduct)
admin_route.get('/editproduct',adminController.Editproduct)
admin_route.post('/editproduct',upload.array('image'),adminController. posteditproduct)
admin_route.delete('/deleteimage',adminController.deleteimage)
admin_route.get('/deleteproduct',adminController.deleteproduct)

admin_route.get('/admin/logout',adminController.logout)

admin_route.get('/orderDatas',Auth.isLogout,adminController.orderList)

admin_route.get('/orderAdminview',adminController.orderViewdatas )
admin_route.post('/updateOrderStatus', adminController.Statusreturn);

admin_route.get('/coupon',Auth.isLogin,couponController.loadCoupon)

admin_route.get('/loadCoupon',couponController.loadCoupon)

admin_route.get('/addCoupon',couponController.loadaddCoupon)

admin_route.post('/loadCoupon',couponController.addCoupon)

admin_route.get('/deletecoupon',couponController.deleteCoupon)

admin_route.get('/loadOffer',offerController.loadOffer)

admin_route.get('/addOffer',offerController.loadaddOffer)

admin_route.get('/offer',offerController.loadOffer)

admin_route.post('/loadOffer',offerController.addOffer )

admin_route.get('/deleteOffer',offerController.deleteOffer)

admin_route.post('/productoffer',offerController.productOffer)

admin_route.post('/categoryOffer',offerController.categoryOffer)

admin_route.get('/applyoffer',offerController.applyOffer)

admin_route.post('/applycategoryOffer',offerController.applyCategoryOffer)

admin_route.post('/removeoffer',offerController.removeCategoryOffer)

admin_route.get('/Salesreport',adminController.salesReport)

admin_route.post('/Salesreport',adminController.salesReportPost)

admin_route.post('/postSalesreport',adminController.salesReportFilter)






admin_route.post('/removeproductoffer',offerController.removeProductOffer)




module.exports = admin_route

