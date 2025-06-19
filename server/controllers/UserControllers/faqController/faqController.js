const axios = require('axios');
const FAQ = require('../../../models/UserModels/FaqChat/FaqChat');
require('dotenv').config(); // Make sure dotenv is installed

// Configuration - Store these securely (environment variables)
const MAX_FAQ_RESULTS = 5;

// Better API key management
const getGeminiAPIKey = () => {
  // Get API key from environment variable (preferred)
  const apiKey = process.env.GENERATIVE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('No Gemini API key found in environment variables');
    return null;
  }
  
  // Basic validation that the key looks reasonable
  if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
    console.warn('Gemini API key appears to be in incorrect format');
  }
  
  return apiKey;
};

// Enhanced FAQ search with multiple matching strategies
const searchFAQ = async (query) => {
  if (!query?.trim()) throw new Error('Invalid query');

  try {
    // 1. Try exact text search first
    let results = await FAQ.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(MAX_FAQ_RESULTS);

    // 2. Fallback to partial matching if no exact matches
    if (results.length === 0) {
      results = await FAQ.find({
        $or: [
          { question: { $regex: query, $options: 'i' } },
          { answer: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).limit(MAX_FAQ_RESULTS);
    }

    return processFAQResults(results, query);
  } catch (error) {
    console.error('FAQ search error:', error);
    throw new Error('Search service unavailable');
  }
};

// Process and rank FAQ results
const processFAQResults = (results, originalQuery) => {
  if (results.length === 0) return null;

  return {
    question: results[0].question,
    answer: results[0].answer,
    confidence: calculateConfidence(results[0], originalQuery),
    source: 'knowledge_base',
    all_matches: results.map(r => ({
      question: r.question,
      answer: r.answer,
      confidence: calculateConfidence(r, originalQuery)
    }))
  };
};

// Confidence scoring algorithm
const calculateConfidence = (result, query) => {
  let score = 0;
  
  // Exact match bonus
  if (result.question.toLowerCase() === query.toLowerCase()) score += 0.3;
  
  // Text length scoring
  score += Math.min(result.question.length / 100, 0.2);
  score += Math.min(result.answer.length / 500, 0.2);
  
  // Keyword overlap
  const queryWords = new Set(query.toLowerCase().split(/\s+/));
  const answerWords = new Set(result.answer.toLowerCase().split(/\s+/));
  const overlap = [...queryWords].filter(w => answerWords.has(w)).length;
  score += Math.min(overlap / queryWords.size, 0.3);
  
  return Math.min(score, 1).toFixed(2);
};

// Function to check API availability before calling Gemini
const checkGeminiAPIAvailability = async (apiKey) => {
  try {
    // List available models to see what's actually accessible
    const modelListUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = await axios.get(modelListUrl, { timeout: 5000 });
    
    if (response.data && response.data.models) {
      console.log('Available Gemini models:');
      response.data.models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName || 'unnamed'})`);
      });
      return response.data.models.map(model => model.name);
    }
    
    return [];
  } catch (error) {
    console.error('Could not retrieve model list:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data));
    }
    return [];
  }
};

// Function to try different Gemini API versions/endpoints
const searchWithGemini = async (query, availableModels = []) => {
  const apiKey = getGeminiAPIKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  console.log('Query to Gemini:', query);

  // Define possible endpoints to try, starting with newest models
  // We'll filter this list based on available models if provided
  let endpoints = [
    {
      name: 'gemini-1.5-pro',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      modelPath: 'candidates[0].content.parts[0].text'
    },
    {
      name: 'gemini-1.5-flash',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      modelPath: 'candidates[0].content.parts[0].text'
    },
    {
      name: 'gemini-pro',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      modelPath: 'candidates[0].content.parts[0].text'
    },
    // Legacy endpoints as fallbacks
    {
      name: 'gemini-1.0-pro-legacy',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`,
      modelPath: 'candidates[0].content.parts[0].text'
    }
  ];

  // If we have a list of available models, only try those endpoints
  if (availableModels.length > 0) {
    endpoints = endpoints.filter(endpoint => {
      // Check if this endpoint's model is in the available models list
      return availableModels.some(model => model.includes(endpoint.name));
    });
    
    if (endpoints.length === 0) {
      console.warn('None of our predefined endpoints match available models');
      // Fall back to trying all endpoints
      endpoints = [
        {
          name: 'gemini-1.5-pro',
          url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
          modelPath: 'candidates[0].content.parts[0].text'
        },
        {
          name: 'gemini-1.5-flash',
          url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          modelPath: 'candidates[0].content.parts[0].text'
        },
        {
          name: 'gemini-pro',
          url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
          modelPath: 'candidates[0].content.parts[0].text'
        }
      ];
    }
  }

  let lastError = null;

  // Try each endpoint until one works
  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint.url}`);
      
      const response = await axios.post(endpoint.url, {
        contents: [
          {
            parts: [
              {
                text: `I'm looking for information about: ${query}. Please provide a concise, factual response.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.8,
          maxOutputTokens: 1024
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      // Process the response based on the model path
      const pathParts = endpoint.modelPath.split('.');
      let data = response.data;
      
      // Navigate through the response structure to extract text
      for (const part of pathParts) {
        if (part.includes('[')) {
          // Handle array notation (e.g., candidates[0])
          const arrayName = part.split('[')[0];
          const index = parseInt(part.split('[')[1].split(']')[0]);
          if (!data[arrayName] || !data[arrayName][index]) {
            data = null;
            break;
          }
          data = data[arrayName][index];
        } else {
          // Handle regular property access
          if (!data[part]) {
            data = null;
            break;
          }
          data = data[part];
        }
      }
      
      // If we have data, return it as the response
      if (data && typeof data === 'string') {
        console.log('Gemini response received');
        return {
          source: 'gemini',
          confidence: '0.85',
          answer: data,
          question: query,
          model: endpoint.name
        };
      }
      
      console.log('Unexpected response format from Gemini, trying next endpoint');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.error(`Error with endpoint ${endpoint.url}:`, error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data));
      }
      lastError = error;
    }
  }

  // If we got here, all endpoints failed
  console.error('All Gemini endpoints failed');
  throw lastError || new Error('Failed to connect to Gemini API');
};

// Main controller
exports.search = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    if (!query) return res.status(400).json({ error: 'Query required' });

    // 1. Try FAQ first
    const faqResult = await searchFAQ(query);
    if (faqResult && parseFloat(faqResult.confidence) > 0.5) {
      console.log(`Found high confidence FAQ match (${faqResult.confidence})`);
      return res.json(faqResult);
    }

    // 2. Check available Gemini models before attempting to use them
    let availableModels = [];
    try {
      const apiKey = getGeminiAPIKey();
      if (apiKey) {
        availableModels = await checkGeminiAPIAvailability(apiKey);
      }
    } catch (checkError) {
      console.error('Error checking Gemini API availability:', checkError);
    }

    // 3. Try Gemini if configured
    if (getGeminiAPIKey()) {
      try {
        const geminiResult = await searchWithGemini(query, availableModels);
        if (geminiResult) {
          console.log(`Got Gemini response using model: ${geminiResult.model || 'unknown'}`);
          return res.json(geminiResult);
        }
      } catch (geminiError) {
        console.error('Gemini search failed:', geminiError);
        // Continue to final fallback
      }
    } else {
      console.warn('Skipping Gemini API call - no API key configured');
    }

    // 4. Return FAQ result even with low confidence if no Gemini result
    if (faqResult) {
      console.log(`Using low confidence FAQ match (${faqResult.confidence})`);
      return res.json(faqResult);
    }
    
    // 5. Final fallback if nothing else worked
    console.log('No results found, returning fallback response');
    res.json({
      answer: "I couldn't find information about that. Please try rephrasing or contact support.",
      confidence: 0,
      source: null
    });
  } catch (error) {
    console.error('Search endpoint error:', error);
    res.status(500).json({ 
      error: 'Search service unavailable',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Expose function to test model availability - useful for diagnostics
exports.testGeminiAvailability = async (req, res) => {
  try {
    const apiKey = getGeminiAPIKey();
    if (!apiKey) {
      return res.status(400).json({ error: 'No Gemini API key configured' });
    }
    
    const availableModels = await checkGeminiAPIAvailability(apiKey);
    
    return res.json({
      success: true,
      availableModels,
      count: availableModels.length
    });
  } catch (error) {
    console.error('Error testing Gemini availability:', error);
    res.status(500).json({
      error: 'Failed to check Gemini API availability',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};