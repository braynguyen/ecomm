const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');

// Create a user
const createUser = asyncHandler(async (req, res) => {
    //check if user already exists
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        //create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        //user already exists
        throw new Error('User Already Exists');
    }
});


//login a user
const loginUserCtrl = asyncHandler(async( req, res ) => {
    const {email, password} = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});


// Delete a single user
const updateaUser = asyncHandler(async (req, res) => {
    console.log(req.user)
    const { id } = req.user;
    //TODO: verify user
    validateMongoDbId(id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
             {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
            }, 
            {
            new: true,
            }
        );
        res.json({
            updatedUser,
        })
    } catch (err) {
        throw new Error(err);
    }
})


// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (err) {
        throw new Error(err);
    }
})


// Get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        })
    } catch (err) {
        throw new Error(err);
    }
})

// Delete a single user
const deleteaUser = asyncHandler(async (req, res) => {
    // console.log(req.params)
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })
    } catch (err) {
        throw new Error(err);
    }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true
            }
        );
        res.json({
            message: "User Blocked",
        })
    } catch (err) {
        throw new Error(err);
    }
});

// unlock a user
const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true
            }
        );
        res.json({
            message: "User Unblocked",
        })
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = {createUser, loginUserCtrl, getAllUsers, getaUser, deleteaUser, updateaUser, blockUser, unblockUser};