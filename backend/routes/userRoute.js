const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles,  } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const User = require("../models/UserModal");
const csrfProtectionMiddleware = require("../middleware/csrfProtection");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginLimiter, loginUser);
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,csrfProtectionMiddleware, updatePassword)
router.route("/me/update").put(isAuthenticatedUser,csrfProtectionMiddleware,updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"), getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser)

// Verify Email Route
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
  
    try {
      const user = await User.findOne({ verificationToken: token });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid token.' });
      }
  
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;