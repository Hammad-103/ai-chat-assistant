const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token from cookies and attaches decoded payload to req.user
 */
const authenticate = (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request object
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle verification errors (invalid or expired token)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { authenticate };
