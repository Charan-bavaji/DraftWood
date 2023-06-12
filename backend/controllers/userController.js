const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModule");
const sendTockens = require("../utils/JTockens");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");
const cloudinary = require("cloudinary")


//Registration of User
exports.register = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    const { name, email, password } = req.body;

    const user = await User.create(
        {
            name, email, password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });

    sendTockens(user, 200, res);
});

//Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    //Checking if user hass given password and e-mail both

    if (!email || !password) {
        return next(new ErrorHander("Please Enter the password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalied email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalied email or password", 401));
    }

    sendTockens(user, 200, res);
});

//LogOut User

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

//Forget Password

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHander("User not found", 404));

    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email
   then please ignore it ttemp.`;

    try {
        await sendEmail({

            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHander(error.message, 500));
    }

});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHander(
                "Reset Password Token is invalid or has been expired",
                400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTockens(user, 200, res);
});

// Get User Detiles 
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander(" password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendTockens(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});
// Get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })
});



// Get induvisal  users (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next
            (new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
            );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// update User Role --- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        roles: req.body.roles,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    if (!user) {

        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400));
    };

    res.status(200).json({
        success: true,
        user,
    });
});

// Delete User-- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});