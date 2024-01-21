#!mdbgum with the extension
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            index:true,
        },
        lastName:{
            type:String,
            required:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        mobile:{
            type:String,
            required:true,
            unique:true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 20, 
        },
        password:{
            type:String,
            required:true,
        },
        role: {
            type: String,
            default:"user"
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        cart: {
            type: Array,
            default: [],
        },
        groups: {
            type: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}],
            default: [],
        },
        address: [{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],
        wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
        refreshToken: {
            type: String
        },
        profilePicture: {
            url: String,
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        PasswordResetExpires: Date,
    },
    {
        timestamps: true,
    },    
);

// encrypting password
userSchema.pre('save', async function(next) {
    //skip if not being modified
    if (!this.isModified('password')) {
        next();
    }
    //10 salt rounds (idk some encrypting stuff)
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.PasswordResetExpires = Date.now() + 30*60*1000; //10 minutes
    return resetToken;
};

//Export the model
module.exports = mongoose.model("User", userSchema);