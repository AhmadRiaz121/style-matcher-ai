import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export function useGeminiApi() {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini-api-key', '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTryOn = useCallback(async (
    profileImage: string,
    clothingImages: string[]
  ): Promise<string | null> => {
    if (!apiKey) {
      setError('Please set your Gemini API key first');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert images to base64 if they're URLs
      const profileBase64 = await imageToBase64(profileImage);
      const clothingBase64 = await Promise.all(clothingImages.map(imageToBase64));

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are a fashion stylist AI. Analyze the person in the first image and the clothing items in the subsequent images. 
                
                Describe in detail how these clothing items would look on this person, including:
                1. How well the colors complement their skin tone
                2. How the style fits their body type
                3. Overall outfit rating (1-10)
                4. Specific styling suggestions
                
                Be detailed and helpful in your fashion advice.`
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: profileBase64.split(',')[1] || profileBase64
                }
              },
              ...clothingBase64.map(img => ({
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: img.split(',')[1] || img
                }
              }))
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate try-on');
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return textResponse || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const validateApiKey = useCallback(async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    apiKey,
    setApiKey,
    isLoading,
    error,
    generateTryOn,
    validateApiKey,
    hasApiKey: !!apiKey,
  };
}

async function imageToBase64(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  const response = await fetch(imageUrl);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
