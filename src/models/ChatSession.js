const {pool} = require('../config/db');

/**
 * Create a new chat session
 * @param {number} userId - User ID
 * @param {string} title - Session title
 * @returns {Promise<Object>} - Created session row
 */
const createSession = async (userId, title) => {
  const query = `
    INSERT INTO chat_sessions (user_id, title)
    VALUES ($1, $2)
    RETURNING id, user_id, title, created_at
  `;
  const result = await pool.query(query, [userId, title]);
  return result.rows[0];
};

/**
 * Get all sessions for a user, ordered by most recent first
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of session rows
 */
const getSessionsByUserId = async (userId) => {
  const query = `
    SELECT id, user_id, title, created_at
    FROM chat_sessions
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

/**
 * Get a single session by ID
 * @param {number} sessionId - Session ID
 * @returns {Promise<Object|null>} - Session row or null if not found
 */
const getSessionById = async (sessionId) => {
  const query = `
    SELECT id, user_id, title, created_at
    FROM chat_sessions
    WHERE id = $1
  `;
  const result = await pool.query(query, [sessionId]);
  return result.rows[0] || null;
};

/**
 * Delete a session by ID
 * @param {number} sessionId - Session ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
const deleteSession = async (sessionId) => {
  const query = `
    DELETE FROM chat_sessions
    WHERE id = $1
  `;
  const result = await pool.query(query, [sessionId]);
  return result.rowCount > 0;
};

module.exports = {
  createSession,
  getSessionsByUserId,
  getSessionById,
  deleteSession
};
