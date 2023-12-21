const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

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


// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find({});
        res.json(getUsers);
    } catch (err) {
        throw new Error(err);
    }
})

module.exports = {createUser, loginUserCtrl, getAllUsers};