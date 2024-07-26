const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { encrypt, decrypt , hashData} = require("../utils/encryption");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter,1 number, and 1 special character",
    ],
  },
  email: {
    type: String,
    required: [true, "Please Enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false, //while searching in mongo it won't show
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  previousPasswords: {
    type: [String], // Array to store previous hashed passwords
    select: false,
  },
  passwordCreated: {
    type: Date, // Store the date when the password was created
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  // Hash password if it is modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the new password
  const hash = await bcrypt.hash(this.password, 10);

  // Store previous password in history
  if (this.previousPasswords) {
    this.previousPasswords.push(hash);
    if (this.previousPasswords.length > 5) { // Limit history to 5 passwords
      this.previousPasswords.shift();
    }
  } else {
    this.previousPasswords = [hash];
  }

  // Update password and password creation date
  this.password = hash;
  this.passwordCreated = new Date();


  // Encrypt name if it is modified
  if (this.isModified("name")) {
    this.name = encrypt(this.name);
  }

  // Encrypt email if it is modified
  if (this.isModified("email")) {
    this.email = hashData(this.email);
  }

  next();
});

// Static method to decrypt fields when retrieving a user
userSchema.methods.decryptFields = function () {
  this.name = decrypt(this.name);
  this.email = hashData(this.email);
};

//JWT TOKEN
userSchema.methods.getJWTTOKEN = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare password
userSchema.methods.comparePassword = async function (enteredPasssword) {
  return await bcrypt.compare(enteredPasssword, this.password);
};

// Generating reset password reset token
userSchema.methods.getResetPasswordToken = function () {
  //generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //hashing and adding reset password token to user
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.verificationToken = token;
  return token;
};

module.exports = mongoose.model("User", userSchema);
