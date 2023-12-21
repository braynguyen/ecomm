const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// create a product
const createProduct = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
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
    getAllProducts
};