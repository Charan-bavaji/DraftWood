const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { reset } = require("nodemon");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter the name"],
        maxlength: [20, "name cannot exceed 20 charecters"],
        minlenth: [4, "name should have more then 4 charecters"]
    },
    email: {
        type: String,
        required: [true, "Please enter E-mail"],
        unique: true,
        validation: [validator.isEmail, "Please enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please enter the passwors"],
        minlength: [8, "password should be more then 8 charecters"],
        select: false
    },
    // confirmPassword: {
    //     type: String,
    //     required: [true, "Please Conform u r password"]
    // },

    avatar: {

        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    roles: {
        type: String,
        default: "user",
    },

    createdAt:{
        type:Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
//JWT Tockens
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


//compareing Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// generating Password Reset token

userSchema.methods.getResetPasswordToken = function () {

    // Generating Token 
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);