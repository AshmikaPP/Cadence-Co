const User = require("../model/userModel");
const Product = require("../model/productModel");
const admin = require("../model/adminModel");
const category = require("../model/categoryModel");
const Cart = require("../model/cartModel");
const Address = require("../model/AddressModel");
const { ObjectId } = require("mongodb");
const Order = require("../model/orderModel");
const { v4: uuidv4 } = require("uuid");
const Wishlist = require("../model/wishlistModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Coupon = require("../model/couponModel")

// var instance = new Razorpay({
//   key_id: 'rzp_test_CYFq5WzXxbZckl',
//   key_secret: '2PHmiXG5UKMqwIV87Q4ccKbK',
// });
const loadcart = async (req, res) => {
  try {
    let id = req.session.UserId;
    let user;
    if (id) {
      user = await User.findOne({ _id: id });
    }
    if (!user) {
      res.redirect("/register");
    }
    // const cartDetails = await cart.findOne({UserId:id})
    const cartProducts = await Cart.findOne({ user: id }).populate({
      path: "product.product_id",
    });

    // const userData = await User.findOne({_id: UserId});

    res.render("cart", { cartProducts });
  } catch (error) {
    console.log(error.message);
  }
};

// const Addcart = async (req, res) => {
//     try {
//         const { productId, name, price, category,quantity } = req.body;
//         // Get quantity from request body

//         // Convert quantity to a number (if it's not already)
//         quantity = parseInt(quantity);

//         console.log("Request Body:", req.body);

//         const userId = req.session.UserId;

//         if (!userId) {
//             return res.json({ success: false, message: "User not currently logged in" });
//         }

//         const user = await User.findOne({ _id: userId });

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         const product = await Product.findOne({ _id: productId });

//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             // If the cart doesn't exist, create a new one
//             cart = new Cart({
//                 user: userId,
//                 product: [{
//                     product_id: productId,
//                     name: name,
//                     price: price,
//                     quantity: quantity,
//                     category: category,
//                     total: price * quantity // Calculate total based on quantity
//                 }]
//             });

//             await cart.save();
//         } else {
//             // Check if the product is already in the cart
//             const existingProduct = cart.products.find(
//                 (x) => x.product_id.toString() === productId
//             );

//             if (existingProduct) {
//                 // If the product exists in the cart, update its quantity and total
//                 existingProduct.quantity += quantity;
//                 existingProduct.total = existingProduct.price * existingProduct.quantity; // Update total based on new quantity
//             } else {
//                 // If the product doesn't exist in the cart, add it to the cart
//                 cart.product.push({
//                     product_id: productId,
//                     name: name,
//                     price: price,
//                     quantity: quantity,
//                     category: category,
//                     total: price * quantity // Calculate total based on quantity
//                 });
//             }

//             await cart.save();
//         }

//         console.log("Product added to cart successfully!");
//         res.json({ success: true, message: "Product added to cart successfully" });
//     } catch (error) {
//         console.log("Error:", error.message);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

const Addcart = async (req, res) => {
  try {
    const { productId } = req.body;
  

    const userId = req.session.UserId;

    if (!userId) {
      return res.json({ success: false, message: "Please login first" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const product = await Product.findById(productId);

    if (!product || product.quantity === 0) {
      return res.json({
        success: false,
        message: "Product not found or out of stock",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      
      cart = new Cart({
        user: userId,
        product: [
          {
            product_id: productId,
            name: product.name,
            price: product.price,
            quantity: 1, 
            category: product.category,
            total: product.price, 
          },
        ],
      });

      await cart.save();
    } else {
    
      const existingProduct = cart.product.find(
        (x) => x.product_id.toString() === productId
      );

      if (existingProduct) {
      
        if (existingProduct.quantity + 1 > product.quantity) {
          return res.json({
            success: false,
            error: "Cannot add more than available quantity",
          });
        }
        existingProduct.quantity += 1;
        existingProduct.total =
          existingProduct.price * existingProduct.quantity; 
      } else {
        
        cart.product.push({
          product_id: productId,
          name: product.name,
          price: product.price,
          quantity: 1, 
          category: product.category,
          total: product.price, 
        });
      }

      await cart.save();
    }

    console.log("Product added to cart successfully!");
    res.json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const productId = req.body.productId;
    const userId = req.session.UserId;
    const count = parseInt(req.body.count);


    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }
  
    const cartProduct = cart.product.find(
      (product) => product.product_id.toString() === productId
    );

    if (!cartProduct) {
      return res.json({
        success: false,
        message: "Product is not found in the cart",
      });
    }

  
    const products = await Product.findById(productId);

    if (!products) {
      return res.json({
        success: false,
        message: "Product not found in the database",
      });
    }

    if (count === 1) {
      
      if (cartProduct.quantity < products.stock) {
        cartProduct.quantity += 1;
        cartProduct.total = cartProduct.quantity * cartProduct.price;
      } else {
        return res.json({ success: false, message: "No more quantity" });
      }
    } else if (count === -1) {
  
      if (cartProduct.quantity > 1) {
        cartProduct.quantity -= 1;
        cartProduct.total = cartProduct.quantity * cartProduct.price;
      } else {
        return res.json({
          success: false,
          message: "Quantity cannot be less than 1",
        });
      }
    }

    cart.subtotal = cart.product.reduce((acc, cur) => acc + cur.total, 0);

  
    await cart.save();

    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: "An error occurred" });
  }
};

const deletecart = async (req, res) => {
  try {
    const id = req.session.UserId;
    const user = await User.findOne({ _id: id });
    const productId = req.query.id;
    const deletecart = await Cart.updateOne(
      { user: id },
      { $pull: { product: { product_id: productId } } }
    );
    res.redirect("/cart");
  } catch (error) {
    console.log(error.message);
  }
};

const Loadcheckout = async (req, res) => {
  try {
    const id = req.session.UserId;
    const objectId = new ObjectId(id);

    const user = await User.findOne({ _id: id });
    const address = await Address.aggregate([
      {
        $match: {
          user: objectId,
        },
      },
      {
        $project: {
          "addresses.fname": 1,
          "addresses.lname": 1,
          "addresses.email": 1,
          "addresses.mobile": 1,
          "addresses.address": 1,
          "addresses.place": 1,
          "addresses.pin": 1,
        },
      },
    ]);
    const coupon = await Coupon.find({})
    const product = await Cart.findOne({ user: id }).populate({
      path: "product.product_id",
    });
    const cartProducts = await Cart.findOne({ user: id }).populate({
      path: "product.product_id",
    });

  
    if (!address) {
      return res.redirect("/addaddress");
    }
    res.render("checkout", {
      product,
      address: address[0].addresses,
      cartProducts: cartProducts,
      coupon 
    });
  } catch (error) {
    console.log(error.message);
  }
};

const checkoutaddaddress = async (req, res) => {
  try {
    const { fname, lname, email, mobile, address, place, pin } = req.body;

    const userid = req.session.UserId;

    const addaddress = await Address.findOneAndUpdate(
      {
        user: userid,
      },
      {
        $push: {
          addresses: {
            fname: fname,
            lname: lname,
            email: email,
            mobile: mobile,
            address: address,
            place: place,
            pin: pin,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.redirect("/checkout");
  } catch (error) {
    console.log(error);
  
    res.status(500).send("An error occurred while adding the address.");
  }
};

const Editaddress = async (req, res) => {
  try {
    const { id, fname, lname, mobile, email, address, place, pin } = req.body; 
    const userId = req.session.UserId;

    const user = await Address.findOne({ user: userId });

    const addressToUpdateIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === id
    );
    if (addressToUpdateIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    const addressToUpdate = user.addresses[addressToUpdateIndex];

    addressToUpdate.fname = fname;
    addressToUpdate.lname = lname;
    addressToUpdate.email = email;
    addressToUpdate.mobile = mobile;
    addressToUpdate.address = address;
    addressToUpdate.place = place;
    addressToUpdate.pin = pin;

    await user.save();

    res.redirect("/profile");
  } catch (error) {
    console.error("Error editing address:", error);
    res.status(500).json({ success: false, message: "Error editing address" });
  }
};

const loadcheckouteditaddress = async (req, res) => {
  try {
    const index = req.query.index;
    const userid = req.session.UserId;
    const address = await Address.findOne({ user: userid });
    const addressData = address.addresses[index];

    res.render("checkouteditaddress", { addressData: addressData });
  } catch (error) {
    console.log(error.message);
  }
};

const checkoutEditaddress = async (req, res) => {
  try {
    const { id, fname, lname, mobile, email, address, place, pin } = req.body; 
    const userId = req.session.UserId;

    const user = await Address.findOne({ user: userId });

    // Find the address to update based on its ID
    const addressToUpdateIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === id
    );
    if (addressToUpdateIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    const addressToUpdate = user.addresses[addressToUpdateIndex];

    // Update address fields
    addressToUpdate.fname = fname;
    addressToUpdate.lname = lname;
    addressToUpdate.email = email;
    addressToUpdate.mobile = mobile;
    addressToUpdate.address = address;
    addressToUpdate.place = place;
    addressToUpdate.pin = pin;

  
    await user.save();

    res.redirect("/checkout");
  } catch (error) {
    console.error("Error editing address:", error);
    res.status(500).json({ success: false, message: "Error editing address" });
  }
};
const placeOrder = async (req, res) => {
  try {
    const index = req.body.addressIndex;
    const paymentMethod = req.body.paymentMethod;
    const userId = req.session.UserId;
    const cart = await Cart.findOne({ user: userId }).populate(
      "product.product_id"
    );

    if (paymentMethod === "wallet") {
      const user = await User.findById(userId);
      
      if (user.wallet < cart.subtotal) {
        console.log("Insufficient balance in wallet");
        return res.status(200).json({
          success: false,
          message: "Insufficient balance in wallet",
        });
      } else {
        await User.findByIdAndUpdate(
          { _id: userId },
          { $inc: { wallet: -cart.subtotal } },
          { new: true }
        );
      }
    }

    const userAddress = await Address.findOne({ user: userId });
    const orderId = uuidv4();
    const status =
      paymentMethod === "COD" || paymentMethod === "wallet"
        ? "placed"
        : "pending";
    const total = cart.subtotal;

    const order = new Order({
      user: userId,
      deliveryDetails: {
        fname: userAddress.addresses[index].fname,
        lname: userAddress.addresses[index].lname,
        email: userAddress.addresses[index].email,
        mobile: userAddress.addresses[index].mobile,
        address: userAddress.addresses[index].address,
        place: userAddress.addresses[index].place,
        pin: userAddress.addresses[index].pin,
      },
      paymentMethod: paymentMethod,
      product: cart.product.map((item) => {
        return {
          product_id: item.product_id._id,
          name: item.product_id.name,
          price: item.product_id.price,
          quantity: item.quantity,
          category: item.product_id.category,
          total: item.quantity * item.product_id.price,
          image: item.product_id.image,
        };
      }),
      subtotal: cart.subtotal,
      status: status,
    });

    await order.save();

    if (paymentMethod === "COD" || paymentMethod === "wallet") {
      for (const cartProduct of cart.product) {
        await Product.findByIdAndUpdate(
          { _id: cartProduct.product_id._id },
          { $inc: { quantity: -cartProduct.quantity } }
        );
      }
      await Cart.deleteOne({ user: userId });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
      });
    } else {
      const instance = new Razorpay({
        key_id: "rzp_test_CYFq5WzXxbZckl",
        key_secret: "2PHmiXG5UKMqwIV87Q4ccKbK",
      });
      const razorpayOrder = await instance.orders.create({
        amount: total * 100,
        currency: "INR",
        receipt: "" + orderId,
      });
      return res.status(200).json({
        success: false,
        message: "Order placed successfully",
        orderId: order._id,
        orders: razorpayOrder ? razorpayOrder : null,
      });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order. Please try again later.",
    });
  }
};


// -----------------------------------------------------
const verifyPayment = async (req, res) => {
  try {
    const userId = req.session.UserId;
    const Data = req.body;
    let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEYSCRETE);
    hmac.update(Data.razorpay_order_id + "|" + Data.razorpay_payment_id);
    const hmacvalue = hmac.digest("hex");
console.log("assalaamu alaikum ");
    if (hmacvalue == Data.razorpay_singnature) {
      for (const Data of Cart.product) {
        const { product_id, quantity } = Data;
        await Product.findByIdAndUpdate(
          { _id: product_id },
          { $inc: { quantity: -quantity } }
        );
      }
    }
    const OrderId = req.body.orderId;
    console.log("pppppppppppppppppppppppppppppppppp",OrderId)
    const newOrder = await Order.findByIdAndUpdate(
      { _id: OrderId },
      { $set: { status: "placed" } }
    );
    const cartdata = await Cart.findOne({ user: userId });
    console.log("dataaaaaaaaaaaa",cartdata);
    for (const Data of cartdata.product) {
      await Product.updateOne(
        { _id: Data.product_id },
        { $inc: { quantity: -Data.quantity } }
      );
    }
    const orderId = newOrder._id;
   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",orderId);
    const cartdelete = await Cart.deleteOne({ _id: cartdata._id });
    res.json({ orderId, success: true });
  } catch (error) {
    console.log(error.message,error);
  }
};




const orderPlaced = async (req, res) => {
  try {
    res.render("placedorder");
  } catch (error) {
    console.log(error.message);
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.session.UserId;
    const wishlist = await Wishlist.find({ user: userId }).populate(
      "product.productId"
    );
    res.render("wishlist", { wishlist });
  } catch (error) {
    console.log(error.message);
  }
};

// addTowishlist controller
const addTowishlist = async (req, res) => {
  try {
    if (req.session.UserId) {
      const userId = req.session.UserId;
      const productId = req.body.Id;
      console.log("222222222222222222222222222222222222", productId);
      
      const wishlist = await Wishlist.findOne({
        user: userId,
        "product.productId": productId,
      });
      console.log("11111111111111111111111111111111111111", wishlist);
      if (wishlist) {
        res.json({ check: true });
      } else {
        
        const data = { productId };
        const wishlist = await Wishlist.findOneAndUpdate(
          { user: userId },
          { $addToSet: { product: data } },
          { upsert: true, new: true }
        );

        res.json({ success: true, data: wishlist });
      }
    } else {
      res.json({ success: false, message: "User not logged in" }); 
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" }); 
  }
};

const removeWishlist = async (req, res) => {
  try {
    const userId = req.session.UserId;
    const productId = req.query.id;
    const removeWishlist = await Wishlist.updateOne(
      { user: userId },
      { $pull: { product: { productId: productId } } }
    );
    res.redirect("/wishlist");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadcart,
  Addcart,
  deletecart,
  updateQuantity,
  Loadcheckout,
  checkoutaddaddress,
  checkoutEditaddress,
  loadcheckouteditaddress,
  placeOrder,
  verifyPayment,
  orderPlaced,
  getWishlist,
  addTowishlist,
  removeWishlist,
};
