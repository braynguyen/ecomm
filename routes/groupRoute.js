const express = require('express');
const { 
    createGroup, 
    updateGroup,
    deleteGroup,
    getaGroup,
    getAllGroups,
    getUsersGroups,
    addUsertoGroup,
    removeUserFromGroup,
} = require('../controller/groupCtrl');
const {groupMiddleware} = require('../middlewares/groupMiddleware');
const router = express.Router();

router.get("/user.groups", groupMiddleware, getUsersGroups);
router.get("/:id", getaGroup); 
router.get("/", getAllGroups);
router.post('/create', groupMiddleware, createGroup);
router.put('/:id/update', groupMiddleware, updateGroup);
router.put("/:id/add", groupMiddleware, addUsertoGroup);
router.put("/:id/remove", groupMiddleware, removeUserFromGroup);
router.delete("/:id", groupMiddleware, deleteGroup);



module.exports = router;