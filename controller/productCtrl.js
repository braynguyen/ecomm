const Product = require("../models/productModel");
const User = require("../models/userModel");
const slugify = require("slugify");
const fs = require('fs')
const asyncHandler = require("express-async-handler");


const validateMongoDbId = require('../utils/validateMongodbid');
const cloudinaryUploadImg = require("../utils/cloudinary");

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
    // console.log(id);
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
    // console.log(id);
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
    // console.log(req.query);
    try {
        const queryObj = {...req.query};
        // Filtering
        const excludeFields = ['page','sort','limit','fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        
        // regex for greater than and less than
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));
        
        let query = Product.find(JSON.parse(queryStr))

        // sorting
        if (req.query.sort) {
            // sort = price,brand => sort = price brand
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            //default sort by date
            query = query.sort('-createdAt'); // - is reverse order
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v'); // removes the __v field which is just for mongoDB
        }

        // pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("This pafe does not exist");
        }
        // console.log(page, limit, skip);

        const product = await query;
        res.json(product);
    } catch(err) {
        throw new Error(err);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {prodId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = await user.wishlist.find((id) => id.toString() === prodId);

        if (alreadyAdded) { // remove if already added
            let user = await User.findByIdAndUpdate(
                _id, 
                {
                $pull: { wishlist: prodId }, //IMPORTANT
                },
                {
                new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                $push: { wishlist: prodId }, //IMPORTANT
                },
                {
                new: true,
                }
            );
            res.json(user);
        }
    } catch (err) {
        throw new Error(err);
    }
});


const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedBy.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updatedRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment}
                },
                {
                    new: true
                }
            );
        } else {
            const ratedProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedBy: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }

        //total rating funtionality
        const getAllRatings = await Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length; //length
        let ratingsum = getAllRatings.ratings //sum
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);

        let actualRating = Math.round(ratingsum/totalRating); // sum/length
        let finalProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating
            }, 
            {
                new: true
            }
        )
        res.json(finalProduct);
    } catch (err) {
        throw new Error(err);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(req.files);
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const {path} = file;
            // console.log(path);
            const newpath = await uploader(path);
            // console.log(newpath)
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        // putting all images in the product database
        const findProduct = await Product.findByIdAndUpdate(
            id, 
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            }
        );
        res.json(findProduct);
    } catch (err) {
        throw new Error(err);
    }
})


module.exports = {
    createProduct,
    getaProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
};