const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', authController.register);

/**
 * POST /auth/login
 * Login user
 */
router.post('/login', authController.login);

/**
 * POST /auth/logout
 * Logout user
 */
router.post('/logout', authController.logout);

/**
 * GET /auth/me
 * Protected route - returns current authenticated user data
 */
router.get('/me', authenticate, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user data'
    });
  }
});

module.exports = router;
