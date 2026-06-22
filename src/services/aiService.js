const { ChatGroq } = require("@langchain/groq");

// Initialize the Groq model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile"
});

/**
 * Generate a response from the AI model
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
const generateResponse = async (userMessage) => {
  try {
    if (!userMessage || typeof userMessage !== "string") {
      throw new Error("Invalid message format");
    }

    const response = await model.invoke(userMessage);

    const responseText = response.content;

    if (!responseText) {
      throw new Error("Empty response from AI model");
    }

    return responseText;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("AI service unavailable");
  }
};

module.exports = {
  generateResponse
};