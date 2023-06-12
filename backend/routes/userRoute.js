const express = require("express");
const {
    register,
    loginUser,
    logout,
    forgetPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

const { isAuthenticatedUser, ARoles } = require("../middleware/auth")
const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgetPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/admin/users").get(isAuthenticatedUser, ARoles("admin"), getAllUsers);

router.route("/admin/user/:id")
    .get(isAuthenticatedUser, ARoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, ARoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, ARoles("admin"), deleteUser);
module.exports = router;
