# Backend Setup Guide

## Overview
The backend API server secures your Gemini API key on the server-side instead of exposing it in the browser. This prevents unauthorized API key access.

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
PORT=3001
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your API key:** https://aistudio.google.com/api-keys

### 2. Start the Backend Server

```bash
npm run server
```

Or with auto-reload during development:
```bash
npm run server:dev
```

The server will start on `http://localhost:3001`

### 3. Start the Frontend

In a separate terminal:
```bash
npm run dev
```

The Vite dev server will start on `http://localhost:8080`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and API key configuration status.

### Generate Content
```
POST /api/gemini/generate
```
Proxies requests to Gemini API with server-side API key.

**Request body:**
```json
{
  "model": "gemini-flash-lite-latest",
  "prompt": "Your prompt here",
  "images": [
    {
      "data": "base64_image_data",
      "mimeType": "image/jpeg"
    }
  ]
}
```

### Validate API Key
```
GET /api/gemini/validate
```
Checks if the server's Gemini API key is valid.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `GEMINI_API_KEY` | Your Gemini API key | Required |

## Security Notes

- ✅ API key is stored server-side in `.env` file
- ✅ `.env` is git-ignored to prevent accidental commits
- ✅ Frontend no longer stores or transmits API keys
- ✅ CORS enabled for local development

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Verify `.env` file exists and has correct format

### API key not working
- Verify your Gemini API key at https://aistudio.google.com/api-keys
- Check for extra spaces or quotes in `.env`
- Restart the server after changing `.env`

### Frontend can't connect
- Ensure backend server is running on port 3001
- Check browser console for CORS errors
- Verify `VITE_API_URL` matches your backend URL (defaults to http://localhost:3001)

## Production Deployment

For production, set these environment variables on your hosting platform:
- `PORT` (assigned by host or your choice)
- `GEMINI_API_KEY` (your production API key)

Common platforms:
- **Vercel/Netlify:** Use serverless functions
- **Railway/Render:** Deploy as Node.js app
- **Heroku:** Add environment vars in dashboard
