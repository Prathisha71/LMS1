import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

router.post('/tutor', requireAuth, async (req, res) => {
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  // If the API key is not configured, provide a friendly educational fallback
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not set. Using mock fallback response.');
    
    const fallbackAnswer = `I'm your **AI Tutor Bot**, but the backend API key (\`GEMINI_API_KEY\`) is not configured yet! 

To get real AI answers, please set up your environment variables:
1. Create a \`.env\` file in the project root folder.
2. Get a free Gemini API Key from Google AI Studio.
3. Add the key to your \`.env\` file:
   \`\`\`env
   GEMINI_API_KEY=your_api_key_here
   \`\`\`
4. Restart the development server.

*Current Question:* "${question}"
*Tutor Tip:* A matrix inverse exists if and only if its determinant is non-zero. Let's make sure the API key is active to solve this and other topics together step-by-step!`;

    return res.json({ answer: fallbackAnswer });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are an encouraging, expert AI Personal Tutor for a student. Keep your explanations clear, structured, and easy to understand. Use Markdown formatting. If the student asks a math/science question, explain step-by-step. If they ask a coding question, write clean code with comments. Always maintain a helpful, teacher-like tone.',
    });

    // Format history for the Gemini API chat
    // The Gemini chat API history expects the format:
    // [{ role: 'user' | 'model', parts: [{ text: string }] }]
    const formattedHistory = Array.isArray(history) 
      ? history.map((msg: any) => {
          let msgText = '';
          if (typeof msg.text === 'string') {
            msgText = msg.text;
          } else if (msg.parts && typeof msg.parts === 'string') {
            msgText = msg.parts;
          } else if (Array.isArray(msg.parts) && msg.parts.length > 0) {
            msgText = msg.parts[0].text || '';
          }
          return {
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msgText }]
          };
        })
      : [];

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const answer = response.text();

    return res.json({ answer });
  } catch (error: any) {
    console.error('Error querying Gemini API:', error);
    return res.status(500).json({ 
      error: 'Failed to generate answer from AI tutor.',
      details: error.message 
    });
  }
});

export default router;
