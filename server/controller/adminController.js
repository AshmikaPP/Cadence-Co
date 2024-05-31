const admin = require('../model/adminModel');
const Users = require("../model/userModel")
const bcrypt = require('bcrypt');
const category = require('../model/categoryModel');
const fs = require('fs')


const product = require('../model/productModel');
const Order = require('../model/orderModel');
const Offer = require('../model/offerModel')





const sharp = require('sharp');
const path = require('path');
const { log } = require('console');

const loadLogin = async (req, res) => {
    try {

        console.log('1')
        res.render('login');
    } catch (error) {
        console.log(error.message);

    }
}


const Dashboard = async ( req,res)=>{
    try {
        res.render("index")
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {

    try {
        console.log("start")
        const email = req.body.email;
        const password = req.body.password;
        console.log(req.body)

        const userData = await admin.findOne({ email: email });
        if (userData) {
            if (password == userData.password ) {
                req.session.admin=userData._id
                console.log();
                res.redirect('/dashboard');
            } else {
                // console.log("incorrect password")
                res.render('login', { message: "password are incorrect" });
            }
        } else {
            res.render('login', { message: 'Email are incorrect' })
        }

    } catch (error) {
        console.log(error)

    }

}

const LoadCategory = async (req, res) => {
    try {
        const Category = await category.find()
        const offers = await Offer.find();
        console.log("yfjjy", Category);
        console.log("vuhkjml",);

        res.render("category", { Category,offers })
    } catch (error) {
        console.log(error.message)
    }
}

const AddCategoty = async (req, res) => {
    try {
        res.render("addCategory")
    } catch (error) {
        console.log(error.message)
    }
}


const postcategory = async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description

        const existcategory = await category.findOne({ name: name })
        if (existcategory) {

            res.redirect('/LoadCategory')

        } else {
            const Category = new category({
                name: name,
                description: description
            })


            await Category.save()

            res.redirect('/LoadCategory')


        }
    } catch (error) {
        console.log(error.message);
    }
}
const  deletecategory = async (req, res) => {
    try {
        const id = req.query.id
        console.log("id", id)
        const categorydelete = await category.deleteOne({ _id: id })
        console.log("deleted");
        res.redirect('/LoadCategory')

    } catch (error) {
        console.log(error.message);
    }
}

const Unlistcategory = async (req, res) => {
    try {
        const id = req.query.id
        console.log("c id", id);
        const Unlistcategory = await category.updateOne({ _id: id },
            { $set: { is_Listed: false } })
        res.redirect('/LoadCategory')

    } catch (error) {
        console.log(error.message)
    }
}
const listcategory = async (req, res) => {
    try {
        const id = req.query.id
        const listcategory = await category.updateOne({ _id: id },
            { $set: { is_Listed: true } })
        res.redirect('/LoadCategory')

    } catch (error) {
        console.log(error.message)
    }
}
const LoadUsers = async (req, res) => {
    try {
        const user = await Users.find()
        res.render('Users', { user })
    } catch (error) {
        console.log(error.message)

    }

}
const blockusers = async (req, res) => {
    try {
        const id = req.query.id
        const blockuser = await Users.updateOne({ _id: id },
            { $set: { is_Blocked: true } })
        res.redirect('/loaduser')
    } catch (error) {
        console.log(error.message)

    }
}
const UnBlock = async (req, res) => {
    try {
        const id = req.query.id
        console.log("huifhh", id);
        const unblock = await Users.updateOne({ _id: id },
            { $set: { is_Blocked: false } })
        res.redirect('/loaduser')
    } catch (error) {
        console.log(error.message)
    }
}
const LoadEdit = async (req, res) => {
    try {
        const id = req.query.id
        const edit = await category.findById(id)
        console.log("huhhfu", edit);
        res.render('editcategory', { edit })
    } catch (error) {
        console.log(error.message);
    }
}
const posteditcategory = async (req, res) => {
    try {
        let id = req.body.categoryid;
        const name = req.body.name;
        const description = req.body.categoryDiscription;
        // const price = req.body.price;
        // const stock = req.body.stock;
        // const category = req.body.category;

        const existeditcategory = await category.findOne({ name: name });

        if (existeditcategory) {
            const edit = await category.findById(id)
            res.render('editcategory', { edit,message:"category already existed" })
        } else {
            const updateedit = await category.findByIdAndUpdate(
                { _id: id },
                { $set: { name: name, description: description } }
            );

            console.log("edit category", updateedit);
            res.redirect('/LoadCategory');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const Loadproduct = async (req,res)=>{
    try {
        const Product = await product.find().populate("category")
        const offers = await Offer.find()
        console.log(Product,"category name from the product")

        res.render("product",{ Product,offers})
    } catch (error) {
        console.log(error.message)
    }

}
const LoadAddProduct= async (req,res)=>{
    try {

        console.log(req.files,'suiodsu');
        const categorydata= await category.find({is_Listed:true});
        

       
        res.render("addProduct",{categorydata})
        
    } catch (error) {   
        console.log(error.message)
    }
}

// const Addproduct = async(req,res)=>{
//     try {
//         // const description = req.body.description;
//         const {name,description,price,stock,edit,categories}=req.body
//         // console.log(req.files)
//         // console.log(req.body);
//         const imageurl=[]
//         console.log("2")
//         for(let i=0;i< req.files.length;i++){
            
//             const cropped = await sharp(req.file[i].path)
//                  .resize({ width:306,height:408,fit: sharp.fit.cover})
//                 .toBuffer();
//             const filename = `cropped_${reg.files[i].originalname}`;
//             imageurl.push(filename);
//             await sharp(cropped).toFile(`server/uploads/product/${filename}`);
           
//         }
//         console.log('1')
//         console.log(imageurl)
//         const existproduct = await product.findOne({name:name})     
//         if(existproduct){
//             res.redirect('/loadproduct')
//         }else{

       
//             const Product = new product({
//                 name:name,
//                 description:description,
//                 price:price,  
//                 stock:stock,
//                 category:categories,
//                 image:imageurl
               


//             })

//             await Product.save()
//             res.redirect('/loadproduct')
//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }
      

const Addproduct = async (req, res) => {
    try {
        const existingProduct = await product.findOne({ name:req.body.name });
        const categorydata= await category.find({is_Listed:true});
        const { name, description, price, stock, edit, categories} = req.body;
        console.log("categories froom product",req.body.categories);
        const existcategory = await category.findOne({name:categories})
        console.log("the existcategory",existcategory)
        const imageUrls = [];
         if(!req.files || req.files.length !== 4){
            return res.render("addProduct",{
                messages:{message:"Your need four photos"},
                categorydata
            })
         }

        for (let i = 0; i < req.files.length; i++) {
            const cropped = await sharp(req.files[i].path)
                .resize({ width: 306, height: 408, fit: sharp.fit.cover })
                .toBuffer();

            const filename = `cropped_${req.files[i].originalname}`;
            imageUrls.push(filename);

            // Save the cropped image to a directory
            await sharp(cropped).toFile(`server/uploads/product/${filename}`);
        }


        if (existingProduct) {
            console.log(`Product ${name} already exists.`);
            res.redirect('/loadproduct');
        } else {
            const newProduct = new product({
                name: name,
                description: description,
                price: price,
                stock: stock,
                category:existcategory._id,
                image: imageUrls
            });

            console.log("the new added product ",newProduct)
            await newProduct.save();
            
            console.log(`New product ${name} added.`);
            res.redirect('/loadproduct');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
};







// const Addproduct = async (req, res) => {
//     try {
//         const { name, description, price, stock, categories } = req.body;
//         const imageUrls = [];

//         for (let i = 0; i < req.files.length; i++) {
//             const croppedBuffer = await sharp(req.files[i].path)
//                 .resize({ width: 306, height: 408, fit: sharp.fit.cover })
//                 .toBuffer();

//             const filename = `cropped_${req.files[i].originalname}`;
//             const imagePath = path.join('uploads', 'ProductImages', filename);
//             imageUrls.push(imagePath);

//             // Save the cropped image
//             await sharp(croppedBuffer).toFile(imagePath);
//         }

//         const existingProduct = await product.findOne({ name: name });

//         if (existingProduct) {
//             console.log(`Product ${name} already exists.`);
//             res.redirect('/loadproduct');
//         } else {
//             const newProduct = new product({
//                 name: name,
//                 description: description,
//                 price: price,
//                 stock: stock,
//                 category: categories,
//                 image: imageUrls
//             });

//             await newProduct.save();
//             console.log(`New product ${name} added.`);
//             res.redirect('/loadproduct');
//         }
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).send('Internal Server Error');
//     }
// };



const Unlistproduct = async (req,res)=>{
    try {
        console.log("kndfknv");
        const id = req.query.id
    console.log(id,"jnsdj")
        const Unlistproduct = await product.updateOne({ _id:id},
            {$set:{ is_Listed: false }})
            res.redirect('/loadproduct')
        
    } catch (error) {
        console.log(error.message)
    }
}
const listproduct = async (req,res)=>{
    try {
        const id = req.query.id

        const listproduct = await product.updateOne({ _id:id},
            {$set:{is_Listed: true }})
            res.redirect('/loadproduct')
    } catch (error) {
        console.log(error.message)
    }
}

const Editproduct = async(req,res)=>{
    try {
        const id = req.query.id
        const edit = await product.findById(id)

        const categorydata= await category.find({is_Listed:true});
        res.render('editproduct', { edit,categorydata })
    } catch (error) {
        console.log(error.message)
    }
}
const posteditproduct = async (req, res) => {
    try {
    
        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        const stock = req.body.stock;
        const category = req.body.category;
        console.log(req.body,"hfiuefufeufuiu");
       
        const id= req.body.productId;
        console.log(id);
        let imageUrls = [];
        // Process image uploads
       
        for (let i = 0; i < req.files.length; i++) {

          
            const cropped = await sharp(req.files[i].path)
                .resize({ width: 306, height: 408, fit: sharp.fit.cover })
                .toBuffer();

            const filename = `cropped_${req.files[i].originalname}`;
          
            // Save the cropped image to a directory
            await sharp(cropped).toFile(`server/uploads/product/${filename}`);
            imageUrls.push(filename);
        }
        console.log(imageUrls);
        // Check if product with the same name already exists
        // let existingProduct = await product.findOne({ name: name });

        
            // Update product information
         const editProdut=   await product.findByIdAndUpdate({_id: id}, {
                name: name,
                description: description,
                price: price,
                stock: stock,
                category: category, // Make sure category data is available
                image:imageUrls
            });

           if(editProdut){
            res.redirect('/loadproduct');
           }
               
            
            
           
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};


const deleteimage = async (req, res) => {
    try {
        const { image, Id } = req.body;
        console.log(image, "image ", Id, "id ");
        fs.unlink(path.join(__dirname,'/server/uploads/product',image),()=>{})
         const ashmika = await product.updateOne({_id:Id},
            {$pull:{image:image}})
            
           res.json({success:true})
        // Handle the deletion logic here
    } catch (error) {
        console.log(error.message);
    }
};

const deleteproduct = async (req, res) => {
    try {
        const id = req.query.id
        console.log("id", id)
        const productdelete = await product.deleteOne({ _id: id })
        console.log("deleted");
        res.redirect('/loadproduct')

    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req,res)=>{
    try {
        req.session.admin=null;
        res.redirect('/admin/login')
    } catch (error) {
        console.log(error.message)
        
    }
}

const orderList = async(req,res)=>{
    try {
        const userId = req.session.admin;
        console.log(userId);
        const orderData = await Order.find()
        console.log(orderData,"ooooooooooooooooooo");
        res.render("orderDetails",{orderData})
    } catch (error) {
        console.log(error.message)
    }
}

const orderViewdatas = async(req,res)=>{
    try {
        const userId = req.session.admin;
        const id = req.query.id;
        const orderViewdetails = await Order.findOne({ _id: id })
        res.render("orderViewdetails",{orderViewdetails})
    } catch (error) {
        console.log(error.message)
    }
}


const Statusreturn = async(req,res)=>{
   try {
    
    const returnStatus = await Order.findOneAndUpdate(
        { _id: req.body.orderId }, 
        { status: req.body.status }, 
        { new: true } 
    );
    res.json({ success: true});


   } catch (error) {
    console.log(error.message)
   }
}

const salesReport = async (req, res) => {
    try {
        console.log(req.query,"yyyyyyyyyyyyyyyyyyyyyy")
        const lateDate = new Date("2024-01-26");

      
        const endDate = new Date();

       
        const orders = await Order.find({
            status: "Delivered",
            date: {
                $gte: lateDate,
                $lte: endDate
            }
        }).sort({ date: -1 });

        console.log("Fetched Orders: ", orders);
        res.render("salesreport", { orders: orders });
    } catch (error) {
        console.error("Error fetching sales report: ", error.message);
        res.status(500).send("Internal Server Error");
    }
};


const salesReportPost = async (req, res) => {
    try {
       console.log('111111111111111111111111111111111',req.body);
       const startDate = req.body.startDate
       const endDate = req.body.endDate
        const orders = await Order.find({
            status: "Delivered",
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: -1 });

        console.log("Fetched Orders: ", orders);
        res.render("salesreport", { orders: orders });
    } catch (error) {
        console.error("Error fetching sales report: ", error.message);
        res.status(500).send("Internal Server Error");
    }
};

const salesReportFilter = async (req, res) => {
    try {
        const selected = req.body.selected;
        let startDate, endDate;

        // Get today's date without the time component
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Determine start and end dates based on selected option
        switch (selected) {
            case 'Today':
                startDate = today;
                endDate = new Date(today); // Copy today's date
                endDate.setDate(endDate.getDate() + 1); // End date is the next day
                break;
            case 'This Week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 6); // Start from past 6 days
                endDate = new Date(); // Today
                break;
            case 'This Month':
                startDate = new Date();
                startDate.setDate(1); // Start from the 1st day of the current month
                endDate = new Date(); // Today
                break;
            case 'This Year':
                startDate = new Date();
                startDate.setMonth(0); // Start from January
                startDate.setDate(1); // Start from the 1st day of January
                endDate = new Date(); // Today
                break;
            case 'Custom Date Range':
                // Handle custom date range separately
                // You can extract start and end dates from req.body accordingly
                break;
            default:
                // Handle default case
        }

        // Query orders based on the determined start and end dates
        const orders = await Order.find({
            status: "Delivered",
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: -1 });

        // Render the sales report with filtered orders
        res.render("salesreport", { orders: orders });
    } catch (error) {
        console.error("Error filtering sales report: ", error.message);
        res.status(500).send("Internal Server Error");
    }
};







module.exports = {
    Dashboard,
    loadLogin,
    verifyLogin,
    LoadCategory,
    AddCategoty,
    postcategory,
    deletecategory,
    Unlistcategory,
    listcategory,
    LoadUsers,
    blockusers,
    UnBlock,
    LoadEdit,
    posteditcategory,
    Loadproduct,
    LoadAddProduct,
    Addproduct,
    Unlistproduct ,
    listproduct,
    Editproduct,
    posteditproduct,
    deleteimage,
    deleteproduct,
    logout,
    orderList,
    orderViewdatas,
    Statusreturn,
    salesReport,
    salesReportPost,
    salesReportFilter 
   


    

}