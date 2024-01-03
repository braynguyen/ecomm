const express = require('express');
const { 
    createProduct, 
    getaProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages, } = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();


router.post("/", authMiddleware, isAdmin,  createProduct); //changed to owner instead of admin
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images',10), productImgResize, uploadImages);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin,  deleteProduct); //changed to owner instead of admin
router.get("/:id", getaProduct); //changed to owner instead of admin
router.get("/", getAllProducts);


module.exports = router;