import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasApiKey: !!GEMINI_API_KEY 
  });
});

// Proxy endpoint for Gemini API
app.post('/api/gemini/generate', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'Server configuration error: Gemini API key not configured' 
    });
  }

  const { model = 'gemini-flash-lite-latest', prompt, images } = req.body;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            ...(images || []).map(img => ({
              inline_data: {
                mime_type: img.mimeType || 'image/jpeg',
                data: img.data
              }
            }))
          ]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
});

// Validate API key endpoint
app.get('/api/gemini/validate', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ 
      valid: false,
      error: 'API key not configured' 
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    
    res.json({ valid: response.ok });
  } catch (error) {
    res.status(500).json({ 
      valid: false,
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`✓ Gemini API key: ${GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
});
