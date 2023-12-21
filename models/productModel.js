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
        unique:true,
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
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    brand: {
        type: String,
        enum: ['Gucci', 'Prada', 'Dior']
    },
    quantity: { //NOT NEEDED
        type:Number, 
        required:true},
    sold: { //NOT NEEDED
        type:Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        enum: ['Black', 'Brown', 'Red']
    },
    ratings: { //NOT NEEDED MAYBE ON USER?
        star: Number,
        postedBy: {type: mongoose.Schema.Types.ObjectId, ref:"User"}, //IMPORTANT
    }
    //ADD GROUPS??
    //ADD USERID
    },
    { timestamps: true}
);

//Export the model
module.exports = mongoose.model('Product', productSchema);