const Group = require("../models/groupModel");
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
        res.json(newGroup);
    } catch (err) {
        throw new Error(err);
    }
});

const updateGroup = asyncHandler(async (req, res) => {
    const { id: userID } = req.user;
    validateMongoDbId(userID);
    const { id: groupID } = req.params;

    console.log('req.user:', req.user);
    console.log('req.params:', req.params);
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


module.exports = {
    createGroup,
    updateGroup,
};