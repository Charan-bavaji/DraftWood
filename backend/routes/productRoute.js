const express = require("express");
const { getAllProducts,
    createProduct,
    updateProduct,
    deletProducts,
    getProductsDetails,
    createProductReview,
    getProductReviews,
    deleteReviews,
    getAdminProducts } = require("../controllers/productController");
const { isAuthenticatedUser, ARoles } = require("../middleware/auth");


const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthenticatedUser, ARoles("admin"), getAdminProducts);

router.route("/admin/product/new")
    .post(isAuthenticatedUser, ARoles("admin"), createProduct);

router.route("/admin/product/:id")
    .put(isAuthenticatedUser, ARoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, ARoles("admin"), deletProducts)

router.route("/product/:id").get(getProductsDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews)
    .delete(isAuthenticatedUser, deleteReviews)// Delete Reviews not working

module.exports = router;