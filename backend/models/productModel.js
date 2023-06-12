const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter Product Name "],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Enter Product description "]
    },
    price: {
        type: Number,
        required: [true, "Enter Product Price"],
        maxLength: [8, "Price connect exceed 4 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },

    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxlength: [4, "Stock cannot exceed 4 charecters"],
        default: 1
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{

        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },

    }],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    cratedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);