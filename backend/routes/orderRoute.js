const express = require("express");
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, ARoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser,
    // ARoles("admin"),
    getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/admin/orders").get(isAuthenticatedUser, ARoles("admin"), getAllOrders);

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, ARoles("admin"), updateOrder) // Stock Is not Updating
    .delete(isAuthenticatedUser, ARoles("admin"), deleteOrder);



module.exports = router;