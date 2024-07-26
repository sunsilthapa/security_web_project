// /utils/sanitize.js
const validator = require('validator');

const sanitizeInput = (input) => {
  let sanitizedInput = validator.trim(input); // Remove whitespace from both ends
  sanitizedInput = validator.escape(sanitizedInput); // Escape HTML characters
  sanitizedInput = validator.stripLow(sanitizedInput, true); // Remove ASCII control characters
  return sanitizedInput;
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validateLength = (input, options) => {
  return validator.isLength(input, options);
};

module.exports = {
  sanitizeInput,
  validateEmail,
  validateLength,
};
