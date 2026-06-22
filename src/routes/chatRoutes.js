const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { rateLimitMiddleware } = require('../middleware/rateLimitMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
  createSession,
  getSessions,
  getMessages,
  sendMessage,
  uploadDocument
} = require('../controllers/chatController');

const router = express.Router();

/**
 * POST /chat/sessions
 * Create a new chat session
 */
router.post('/sessions', authenticate, createSession);

/**
 * GET /chat/sessions
 * Get all chat sessions for authenticated user
 */
router.get('/sessions', authenticate, getSessions);

/**
 * GET /chat/sessions/:sessionId/messages
 * Get all messages for a specific session
 */
router.get('/sessions/:sessionId/messages', authenticate, getMessages);

/**
 * POST /chat/sessions/:sessionId/messages
 * Send a message to a chat session
 * Protected by authentication and rate limiting
 */
router.post('/sessions/:sessionId/messages', authenticate, rateLimitMiddleware, sendMessage);

/**
 * POST /chat/sessions/:sessionId/upload
 * Upload and process a PDF document for RAG
 */
router.post('/sessions/:sessionId/upload', authenticate, upload.single('document'), uploadDocument);

module.exports = router;