const { findById } = require("../models/productModel");
const Product = require("../models/productModel")
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Apifeature = require("../utils/apifeature");
const ErrorHandler = require("../utils/errorhander");
const cloudinary = require("cloudinary");

// Create Product ---Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apifeature = new Apifeature(Product.find(), req.query)
        .search().
        filter()
        .pagination(resultPerPage);
    const products = await apifeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
    });

});

//Get all products  (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });

});

// Get Products Details
exports.getProductsDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not Found", 404));

    }

    res.status(200).json({
        success: true,
        product,
    });
});



//Update Product ----Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not Found", 404));
    }

    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }


    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndMOdify: false
    });

    res.status(200).json({
        success: true,
        product,
    });
});

//Delet Product

exports.deletProducts = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not Found", 404));

    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
});

// Create New Review Or Update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);


    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString())
                rev.rating = rating,
                    rev.comment = comment
        });

    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    //

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get All Reviews of a Product

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {

        return next(new ErrorHander("Product not found", 400));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Reviews

exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHander("Product not found", 400));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    const ratings = avg / reviews.length;

    const numberOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId, {
        reviews,
        ratings,
        numberOfReviews,
    },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    )

    res.status(200).json({
        success: true,
    });
});
