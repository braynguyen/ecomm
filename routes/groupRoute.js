const express = require('express');
const { 
    createGroup, 
    updateGroup,
} = require('../controller/groupCtrl');
const {groupMiddleware} = require('../middlewares/groupMiddleware');
const router = express.Router();

router.post('/create', groupMiddleware, createGroup);
router.put('/:id/update', groupMiddleware, updateGroup);

// router.delete("/:id", authMiddleware,  deleteProduct);
// router.get("/:id", getaProduct); 
// router.get("/", getAllProducts);
// router.get("/user-groups", authMiddleware, getUsersGroups)

module.exports = router;