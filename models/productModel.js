const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title :{
        type:String,
        required:true,
        trim: true,
    },
    slug:{
        type:String,
        required:true,
        // unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{ //MAYBE NEEDED
        type:Number,
        required:true,
    },
    category: {
        type: String,
        // ref:"Category",
        required: true,
    },
    brand: {
        type: String,
        // enum: ['Gucci', 'Prada', 'Dior']
        required: true
    },
    quantity: { //NOT NEEDED
        type:Number, 
        required:true},
    sold: { //NOT NEEDED
        type:Number,
        default: 0,
        select: false, //hidden from user
    },
    images: [],
    color: {
        type: String,
        // enum: ['Black', 'Brown', 'Red']
        required: true
    },
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: {type: mongoose.Schema.Types.ObjectId, ref:"User"}, //IMPORTANT
        }
    ],
    totalrating: {
        type: String,
        default: 0,
    }
    //ADD GROUPS??
    //ADD USERID
    },
    { timestamps: true}
);

//Export the model
module.exports = mongoose.model('Product', productSchema);