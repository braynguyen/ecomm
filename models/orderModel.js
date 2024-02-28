const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ]
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);