#!mdbgum with the extension
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    lastName:{
        type:String,
        required:true,
        unique:true,
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
        maxlength: 20, // Set the maximum length for the username
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default:"user"
    }
});

// encrypting password
userSchema.pre('save', async function(next) {
    //10 salt rounds
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Export the model
module.exports = mongoose.model("User", userSchema);