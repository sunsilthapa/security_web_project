const sendToken = (user, statusCode, res) => {
    const token = user.getJWTTOKEN();
    // Options for the cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' ? true : false, // Use 'false' for local development
    };
    // Send the token in a cookie to the client
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;
