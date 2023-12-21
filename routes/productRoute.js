const express = require('express');
const { 
    createProduct, 
    getaProduct,
    getAllProducts,
    updateProduct,
    deleteProduct, } = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/", authMiddleware, isAdmin,  createProduct); //changed to owner instead of admin
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin,  deleteProduct); //changed to owner instead of admin
router.get("/:id", getaProduct); //changed to owner instead of admin
router.get("/", getAllProducts);


module.exports = router;