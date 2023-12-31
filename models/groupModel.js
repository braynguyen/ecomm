const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    }],    
    admin: {
        type: mongoose.Schema.Types.ObjectId, ref:"User",
        required: true,
    },
    description: {
        type: String,
        validate: {
            validator: function (value) {
                // Add your custom validation logic here
                return value.length <= 500;
            },
            message: props => `Description must be at most 500 characters!`,
        },
    },
    
}, {
    timestamps: true,
});




//Export the model
module.exports = mongoose.model('Group', groupSchema);