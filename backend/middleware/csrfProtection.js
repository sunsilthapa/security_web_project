// middleware/csrfProtection.js
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

const csrfProtectionMiddleware = (req, res, next) => {
    csrfProtection(req, res, () => {
        const token = req.csrfToken(); // Generate or access the CSRF token
        console.log('CSRF Token:', token); // Log the token for debugging
        next();
    });
};

module.exports = csrfProtectionMiddleware;
