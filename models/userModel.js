import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// User Schema
const userSchema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: [true, "First Name is compulsory"]
    },
    Last_Name: {
        type: String,
        required: [true, "Last Name is compulsory"]
    },
    email: {
        type: String,
        required: [true, "Email is compulsory"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is compulsory"]
    },
    phone: {
        type: String,
        required: [true, "Phone is compulsory"],
        unique: true,
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "user",
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type:String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
});

// Pre-save middleware for hashing password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method for comparing entered password with the hashed password in the database
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method for creating a password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token and store it in the database
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set expiration time for the reset token
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes from now

    return resetToken;
};

// Export the model
const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;
