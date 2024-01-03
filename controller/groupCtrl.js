const Group = require("../models/groupModel");
const User = require("../models/userModel");
const validateMongoDbId = require('../utils/validateMongodbid');
const asyncHandler = require("express-async-handler");
const slugify = require('slugify');

const createGroup = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        if(req.body.name) { //CHANGE THIS SO IT IS BASED OFF TITLE AND USER(?)
            req.body.slug = slugify(req.body.name)
        }
        req.body.users = [id];
        req.body.admin = id;
        const newGroup = await Group.create(req.body);

        const user = await User.findById(id);
        user.groups.push(newGroup.id);
        await user.save();

        res.json(newGroup);
    } catch (err) {
        throw new Error(err);
    }
});

const updateGroup = asyncHandler(async (req, res) => {
    const { id: userID } = req.user;
    validateMongoDbId(userID);
    const { id: groupID } = req.params;

    // console.log('req.user:', req.user);
    // console.log('req.params:', req.params);
    try {
        if(req.body.name) { //CHANGE THIS SO IT IS BASED OFF TITLE AND USER(?)
            req.body.slug = slugify(req.body.name)
        }
        const updatedGroup = await Group.findByIdAndUpdate(groupID, req.body, {new: true})
        res.json(updatedGroup);
    } catch (err) {
        throw new Error(err);
    }
});

const deleteGroup = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedGroup = await Group.findByIdAndDelete(id);
        res.json(deletedGroup);
    } catch (err) {
        throw new Error(err);
    }
});

const getaGroup = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const foundGroup = await Group.findById(id);
        res.json(foundGroup);
    } catch (err) {
        throw new Error(err);
    }
});

const getAllGroups = asyncHandler(async (req, res) => {
    try {
        const allGroups = await Group.find();
        res.json(allGroups);
    } catch (err) {
        throw new Error(err);
    }
});

const getUsersGroups = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        const user = await User.findById(id);
        res.send(user.groups)
    } catch (err) {
        throw new Error(err);
    }
});


// assumes that the user either clicks a link or hits a button to join a group
const addUsertoGroup = asyncHandler(async (req, res) => {
    const {id: groupID} = req.params;
    validateMongoDbId(groupID);
    const {id: userID} = req.user;
    validateMongoDbId(userID);
    try {
        const updatedGroup = await Group.findById(groupID);
        const updatedUser = await User.findById(userID);
        
        if (updatedGroup.users.indexOf(userID) === -1) {
            updatedGroup.users.push(userID);
            //might want to separate
            updatedUser.groups.push(groupID);

            await updatedGroup.save();
            await updatedUser.save();
        }
        res.json({
            updatedGroup,
            updatedUser,
        })
    } catch (err) {
        throw new Error(err);
    }
})


// look at addtowishlist function on productCtrl
const removeUserFromGroup = asyncHandler(async (req, res) => {
    const {id: groupID} = req.params;
    validateMongoDbId(groupID);
    const {id: userID} = req.user;
    validateMongoDbId(userID);
    try {
        // console.log("GroupId: " + groupID);
        // console.log("UserID: " + userID);

        const updatedGroup = await Group.findByIdAndUpdate(groupID);
        updatedGroup.users = updatedGroup.users.filter(user => user.id.toString('hex') !== userID);

        const updatedUser = await User.findByIdAndUpdate(userID);
        updatedUser.groups = updatedUser.groups.filter(group => group.id.toString('hex') !== groupID);

        await updatedGroup.save();
        await updatedUser.save();

        res.json({
            updatedGroup,
            updatedUser,
        })
    } catch (err) {
        throw new Error(err);
    }
})


module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getaGroup,
    getAllGroups,
    getUsersGroups,
    addUsertoGroup,
    removeUserFromGroup,
};