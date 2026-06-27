const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { MemoryVectorStore } = require('@langchain/classic/vectorstores/memory');

// In-memory store for vector stores: sessionId -> MemoryVectorStore
const vectorStores = {};

/**
 * Process a PDF document and create embeddings for RAG
 * @param {number} sessionId - Chat session ID
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {Promise<number>} - Number of chunks created
 */
const processDocument = async (sessionId, fileBuffer) => {
  try {
    // Lazy-load pdf-parse only when this function actually runs,
    // so it doesn't crash the whole serverless function on cold start
    const pdfParse = require('pdf-parse');

    // Extract text from PDF
    const pdfData = await pdfParse(fileBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim() === '') {
      throw new Error('No text content found in PDF');
    }

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });

    const chunks = await textSplitter.splitText(pdfText);

    if (chunks.length === 0) {
      throw new Error('Failed to create text chunks from PDF');
    }

    // Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'text-embedding-004'
    });

    // Create vector store from chunks
    const vectorStore = await MemoryVectorStore.fromTexts(chunks, [], embeddings);

    // Store vector store in memory
    vectorStores[sessionId] = vectorStore;

    return chunks.length;
  } catch (error) {
    console.error('Error processing document:', error.message);
    throw error;
  }
};

/**
 * Get relevant context from the document for a query
 * @param {number} sessionId - Chat session ID
 * @param {string} query - User query
 * @returns {Promise<string|null>} - Combined relevant context or null if no vector store
 */
const getRelevantContext = async (sessionId, query) => {
  try {
    // Check if vector store exists for this session
    const vectorStore = vectorStores[sessionId];
    if (!vectorStore) {
      return null;
    }

    // Perform similarity search
    const searchResults = await vectorStore.similaritySearch(query, 3);

    if (searchResults.length === 0) {
      return null;
    }

    // Combine the content from search results
    const relevantContext = searchResults
      .map(result => result.pageContent)
      .join('\n\n');

    return relevantContext;
  } catch (error) {
    console.error('Error getting relevant context:', error.message);
    return null;
  }
};

module.exports = {
  processDocument,
  getRelevantContext
};