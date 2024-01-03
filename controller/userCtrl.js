const { generateToken } = require('../config/jwtToken'); // token is if admin or refresh token
const User = require('../models/userModel'); // User is the schema that is being used
const asyncHandler = require('express-async-handler'); // for async functions in express
const validateMongoDbId = require('../utils/validateMongodbid');
const {generateRefreshToken} = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../controller/emailCtrl')
const crypto = require('crypto');
const Product = require('../models/productModel');
const cloudinaryUploadImg = require('../utils/cloudinary');

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
        // cookies so people stay logged in on refresh
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findOneAndUpdate(findUser?._id, {refreshToken: refreshToken}, {new: true});
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000 //3 days in milliseconds
        });

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

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("No refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    });
});


// logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    //setting refresh token to empty and clearing cookies
    await User.findOneAndUpdate({refreshToken}, {refreshToken: ""});
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204); // forbidden
});


// update a single user
const updateaUser = asyncHandler(async (req, res) => {
    // console.log(req.user)
    const { id } = req.user;
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
        res.json(getaUser)
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

const updatePassword = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const {password} = req.body;
    validateMongoDbId(id);
    const user = await User.findById(id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save(); //reset token is saved
        // console.log(user)
        const resetURL = `Hi, Please follow the provided link to reset your password. This link is valid for 10 minutes. <a href='http://localhost:5000/api/user/reset-password/${token}'>Reset Password</>`;
        const data = {
            to: email,
            text: "Hey User,",
            subject: "Forgot Password",
            html: resetURL
        }
        // console.log(data)
        sendEmail(data);
        res.json(token);
    } catch(err) {
        throw new Error(err);
    }
});


const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        PasswordResetExpires: {$gt: Date.now()}
    });
    if (!user) throw new Error("Token has expired. Please try again later.");
    user.password = password;
    user.passwordResetToken = undefined;
    user.PasswordResetExpires = undefined;
    await user.save();
    res.json(user);
})



// CHANGE TO ONE PICTURE
const uploadpfp = asyncHandler(async (req, res) => { 
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
        }
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
    createUser, 
    loginUserCtrl, 
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
};