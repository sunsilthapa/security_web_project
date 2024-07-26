const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/UserModal");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const logActivity = require('../utils/logActivity'); // Import logActivity
const { encrypt, hashData } = require("../utils/encryption");
const { sanitizeInput } = require("../utils/sanintizeInput");
const multer = require('multer')

// Middleware to filter image files
const imageFileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Only images allowed!" }, false);
  }
};

// Multer configuration for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: imageFileFilter });


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  // Apply image filter
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Invalid file type',
      });
    }

    // Proceed if no error
    console.log(req.body);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const { name, email, password } = req.body;

      // Sanitize inputs

  // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);


    const user = new User({
      sanitizedName,sanitizedEmail, password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    });

    // Save the user with the verification token
    await user.save();

    // Log user registration activity
    await logActivity(user._id, 'register', {sanitizedEmail, sanitizedName });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const message = `Please verify your email by clicking on the following link: \n\n${verificationUrl}`;

    await sendEmail({
      email: emasanitizedEmail,
      subject: 'Email Verification',
      message,
    });

    sendToken(user, 201, res);
  });
});


//todo: Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);
    // Checking if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
    }
    // const encryptedEmail = encrypt(email);
    // console.log("Encrypted email ", encryptedEmail)

      // Hash the email for comparison  
      const hashedEmail = hashData(email);
      console.log("Hashed email ", hashedEmail);

    const user = await User.findOne({ email: hashedEmail }).select("+password +previousPasswords +passwordCreated");

    console.log("Verified Check ", user)

    if (!user.isVerified) {
      return next(new ErrorHandler('Please verify your email first.', 400));
    }
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        // Log failed login attempt
        await logActivity(null, 'login_failed', { email });
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    // Log successful login activity
    await logActivity(user._id, 'login', { email });

    // Decrypt user fields before sending the response
    user.decryptFields();


    // Check for password expiry (90 days)
    const currentDate = new Date();
    const passwordAge = (currentDate - user.passwordCreated) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    if (passwordAge > 90) {
      return res.status(403).json({
        message: 'Password expired. Please update your password.',
        role: user.role,
        passwordExpired: true,
      });
    }

    sendToken(user, 201, res);
});


//todo: Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})

//todo:Forgot password
exports.forgotPassword= catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    //reset pasword token
    const resetToken =  user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message =`Your password reset token is :-\n\n ${resetPasswordUrl}`;
    
    try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message

        })

        res.status(200).json({
            success:true,
            message:`Email sennt to ${user.email} successfully`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500))
    }
})

// todo: Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Debug: log the received token
  // console.log('Received reset token:', req.params.token);

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Debug: log the hashed token
  // console.log('Hashed reset token:', resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now()},
  });

  // Debug: log the found user
  // console.log('Found user:', user);

  if (!user) {
    return next(
      new ErrorHandler('Reset Password Token is invalid or has expired', 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Debug: log the user before saving

  await user.save();

  // Debug: log after user has been saved
  // console.log('User after saving:', user);

  sendToken(user, 200, res);
});




//get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    user.decryptFields();
    console.log("Single user" ,user)
    res.status(200).json({
        success:true,
        user
    })
});


//todo: update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log("UPDATE PASSWORD ", req.body);

  const user = await User.findById(req.user.id).select("+password +previousPasswords +passwordCreated");

  // Check if old password matches
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Check if new password matches confirm password
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Check if new password matches any of the previous passwords
  let repeatedPassword = false;
  for (let index = 0; index < user.previousPasswords.length; index++) {
    const isRepeated = await bcrypt.compare(req.body.newPassword, user.previousPasswords[index]);
    if (isRepeated) {
      repeatedPassword = true;
      break;
    }
  }
  if (repeatedPassword) {
    return next(new ErrorHandler("Password has been used before. Please choose a new password.", 400));
  }
  // Update password and save to the previousPasswords history
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
  user.previousPasswords.push(hashedPassword);
  // Ensure previousPasswords only holds the last 5 passwords
  if (user.previousPasswords.length > 5) {
    user.previousPasswords.shift();
  }
  // Set the new password and update password creation date
  user.password = hashedPassword;
  user.passwordCreated = new Date();
  await user.save();
  // Send new token after password update
  sendToken(user, 200, res);
});
 

// //update user profile
// exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//   };

//   if (req.body.avatar !== "") {
//     const user = await User.findById(req.user.id);

//     const imageId = user.avatar.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//       folder: "avatars",
//       width: 150,
//       crop: "scale",
//     });

//     newUserData.avatar = {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     };
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//   });
// });

// Update user profile
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
    };
  }

  // Encrypt the new fields before updating
  if (newUserData.name) newUserData.name = encrypt(newUserData.name);
  if (newUserData.email) newUserData.email = encrypt(newUserData.email);

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});



  // //get all user (admin)
  exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
      // Decrypt user fields before sending the response
  users.decryptFields();
  res.status(200).json({
    success: true,
    users,
  });
  });



  // get single user detail(admin)
  exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
      // Decrypt user fields before sending the response
    user.decryptFields();
    console.log("Single user" ,user)
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });

//update user role (admin)
  exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role:req.body.role,
    };
    let user = User.findById(req.params.id);
    if(!user){
      return next(
        new ErrorHandler(`User does not Exist with id : ${req.params.id}`,400)
      )
    }


    user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });

  //delete any user
  exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
      }
      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);
      await user.remove();
    res.status(200).json({
      success: true,
      message:"user deleted successfully"
    });
  });

  

  
