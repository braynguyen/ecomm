const express = require('express');
const { 
    createUser, 
    loginUserCtrl, 
    loginAdmin,
    getAllUsers, 
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    uploadpfp,
    getWishlist,
    saveAddress, } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, pfpImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/reset-password/:token", resetPassword);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);

router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, isAdmin, getaUser);

router.delete("/:id", deleteaUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/edit-user", authMiddleware, isAdmin, updateaUser);

router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images',1), pfpImgResize, uploadpfp); //TODO



// router.get("/refresh", handleRefreshToken);

module.exports = router;