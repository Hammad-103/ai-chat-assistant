const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const { generateResponse } = require('../services/aiService');
const { processDocument, getRelevantContext } = require('../services/ragService');

/**
 * Create a new chat session
 * POST /chat/sessions
 */
const createSession = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    // Use default title if not provided
    const sessionTitle = title || `Chat ${new Date().toLocaleString()}`;

    // Create session in database
    const session = await ChatSession.createSession(userId, sessionTitle);

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all chat sessions for authenticated user
 * GET /chat/sessions
 */
const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Fetch all sessions for user
    const sessions = await ChatSession.getSessionsByUserId(userId);

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all messages for a specific session
 * GET /chat/sessions/:sessionId/messages
 */
const getMessages = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Verify session exists
    const session = await ChatSession.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this session'
      });
    }

    // Fetch messages
    const messages = await Message.getMessagesBySessionId(sessionId);

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message to a chat session
 * POST /chat/sessions/:sessionId/messages
 */
const sendMessage = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // Validate content is not empty
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    // Verify session exists
    const session = await ChatSession.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this session'
      });
    }

    // Create user message
    const userMessage = await Message.createMessage(sessionId, 'user', content.trim());

    // Get relevant context from uploaded documents if available
    const relevantContext = await getRelevantContext(sessionId, content.trim());
    
    // Build the prompt with context if available
    let promptForAI = content.trim();
    if (relevantContext) {
      promptForAI = `Context from documents:\n${relevantContext}\n\nUser question: ${content.trim()}`;
    }

    // Generate AI response
    let assistantMessage;
    try {
      const aiResponse = await generateResponse(promptForAI);
      assistantMessage = await Message.createMessage(sessionId, 'assistant', aiResponse);
    } catch (aiError) {
      // If AI service fails, return 503 but keep the user message saved
      return res.status(503).json({
        success: false,
        message: 'AI response generation failed',
        data: {
          userMessage,
          assistantMessage: null
        }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        userMessage,
        assistantMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload and process a PDF document
 * POST /chat/sessions/:sessionId/upload
 */
const uploadDocument = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Verify session exists
    const session = await ChatSession.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this session'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Process the PDF document
    const chunksCreated = await processDocument(sessionId, req.file.buffer);

    res.status(200).json({
      success: true,
      message: 'Document processed',
      chunksCreated: chunksCreated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
  getMessages,
  sendMessage,
  uploadDocument
};
