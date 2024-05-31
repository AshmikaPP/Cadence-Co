const Order = require('../model/orderModel')
const Product = require('../model/productModel');
const category = require('../model/categoryModel');
const Offer = require('../model/offerModel')

const loadOffer = async(req,res)=>{
    try {
        const offers = await Offer.find()
        res.render("offer",{offers})
    } catch (error) {
        console.log(error.message)
    }
}

const loadaddOffer = async(req,res)=>{
    try {
        res.render("addOffer")
    } catch (error) {
        console.log(error.message)
    }
}

const addOffer = async(req,res)=>{
    try {
        const data = new Offer({
            name:req.body.name,
            discount:req.body.discount,
            activationdate:req.body.activationdate,
            expireddate:req.body. expireddate
        })
        const offerdata = await data.save()
        res.redirect("/loadOffer")
    } catch (error) {
        console.log(error.message)
    }
}

const deleteOffer = async(req,res)=>{
    try {
        const id = req.query.id;
        const deleteoffer = await Offer.deleteOne({_id:id})
        res.redirect("/loadOffer")
    } catch (error) {
        console.log(error.message)
    }
}

const productOffer = async(req,res)=>{
    try {
        const { productId, discountPercentage } = req.body;

        // Validate the input
        if (!productId || !discountPercentage) {
            return res.status(400).json({ message: 'Product ID and discount percentage are required.' });
        }

        // Find the product by ID and update the productoffer field
        const product = await Product.findByIdAndUpdate(
            productId,
            { productoffer: discountPercentage,is_offerapply: true },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product offer updated successfully.', product });
    } catch (error) {
        console.error('Error updating product offer:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const categoryOffer = async(req,res)=>{
    try {
        console.log(req.body,"yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    } catch (error) {
        console.log(error.message)
    }
}

const applyOffer = async(req, res) => {
    try {
        const categoryId = req.query.id;
        console.log("uuuuuuuuu",categoryId );
        const offers = await Offer.find({});
        console.log("Offers data:", offers,);
        res.render("categoryOffer", { offers: offers,categoryId  });
    } catch (error) {
        console.log(error.message);
    }
}

const applyCategoryOffer = async (req, res) => {
    try {
        const { offerId, discount, categoryId } = req.body;

        // Validate the input
        if (!offerId || !discount || !categoryId) {
            return res.status(400).json({ message: 'Offer ID, discount percentage, and category ID are required.' });
        }

        // Ensure the offer exists (optional)
        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found.' });
        }

        // Update the category with the new discount
        const Category = await category.findByIdAndUpdate(
            categoryId,
            { categoryoffer: discount,is_offerapply: true },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        console.log("Category updated:", category); // Log the updated category
        res.status(200).json({ message: 'Category offer updated successfully.', Category });
    } catch (error) {
        console.error('Error updating category offer:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const removeCategoryOffer = async (req, res) => {
    try {
        console.log('111111111111111111111111111111111111111111111111111111111');
        const { categoryId } = req.body;

        // Validate the input
        if (!categoryId) {
            return res.status(400).json({ message: 'Category ID is required.' });
        }

        // Update the category to remove the offer
        const Category = await category.findByIdAndUpdate(
            categoryId,
            { categoryoffer: 0, is_offerapply: false },
            { new: true }
        );

        if (!Category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json({ message: 'Category offer removed successfully.', Category });
    } catch (error) {
        console.error('Error removing category offer:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const removeProductOffer = async (req, res) => {
    try {
        const { productId } = req.body;

        // Validate the input
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }

        // Update the product to remove the offer
        const product = await Product.findByIdAndUpdate(
            productId,
            { productoffer: 0, is_offerapply: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product offer removed successfully.', product });
    } catch (error) {
        console.error('Error removing product offer:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};







module.exports = {
    loadOffer,
    loadaddOffer,
    addOffer,
    deleteOffer,
    productOffer,
    categoryOffer,
    applyOffer,
    applyCategoryOffer,
    removeCategoryOffer,
    removeProductOffer

}