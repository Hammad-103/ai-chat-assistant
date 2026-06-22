const { pool } = require('../config/db');

/**
 * Create a new message in a session
 * @param {number} sessionId - Session ID
 * @param {string} role - Message role ('user' or 'assistant')
 * @param {string} content - Message content
 * @returns {Promise<Object>} - Created message row
 */
const createMessage = async (sessionId, role, content) => {
  const query = `
    INSERT INTO messages (session_id, role, content)
    VALUES ($1, $2, $3)
    RETURNING id, session_id, role, content, created_at
  `;
  const result = await pool.query(query, [sessionId, role, content]);
  return result.rows[0];
};

/**
 * Get all messages for a session, ordered by oldest first
 * @param {number} sessionId - Session ID
 * @returns {Promise<Array>} - Array of message rows
 */
const getMessagesBySessionId = async (sessionId) => {
  const query = `
    SELECT id, session_id, role, content, created_at
    FROM messages
    WHERE session_id = $1
    ORDER BY created_at ASC
  `;
  const result = await pool.query(query, [sessionId]);
  return result.rows;
};

module.exports = {
  createMessage,
  getMessagesBySessionId
};
