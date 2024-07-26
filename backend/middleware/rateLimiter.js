const rateLimit = require('express-rate-limit');

// Define rate limiter middleware
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 3, // limit each user to 5 login attempts per windowMs
  keyGenerator: function (req) {
    return req.body.email; // use email as the key
  },
  handler: function (req, res) {
    res.status(429).json({
      message: "Too many login attempts, please try again later.",
    });
  },
});

module.exports = { loginLimiter };
