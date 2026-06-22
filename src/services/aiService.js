const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

// Initialize the Google Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-2.5-flash'
});

/**
 * Generate a response from the AI model
 * @param {string} userMessage - The user's message content
 * @returns {Promise<string>} - The AI's response text
 * @throws {Error} - If AI service is unavailable
 */
const generateResponse = async (userMessage) => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('Invalid message format');
    }

    // Invoke the model with the user message
    const response = await model.invoke(userMessage);

    // Extract and return the response content
    const responseText = response.content;

    if (!responseText) {
      throw new Error('Empty response from AI model');
    }

    return responseText;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    throw new Error('AI service unavailable');
  }
};

module.exports = {
  generateResponse
};
