const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModule");


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();
});

exports.ARoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.roles)) {
            return next(new ErrorHandler(`Role: ${req.user.roles} is not allowed to acces this resource`,
                403
            )
            );
        }
        next();
    };
};