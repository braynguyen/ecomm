const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// create a product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.title) { //CHANGE THIS SO IT IS BASED OFF TITLE AND USER(?)
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (err) {
        throw new Error(err);
    }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        if(req.body.title) { //CHANGE THIS SO IT IS BASED OFF TITLE AND USER(?)
            req.body.slug = slugify(req.body.title)
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updatedProduct)
    } catch (err) {
        throw new Error(err);
    }
});


// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json(deletedProduct)
    } catch (err) {
        throw new Error(err);
    }
});


// get a singular product by id
const getaProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch(err) {
        throw new Error(err);
    }
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const getAllProducts = await Product.find();
        res.json(getAllProducts);
    } catch(err) {
        throw new Error(err);
    }
});



module.exports = {
    createProduct,
    getaProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};