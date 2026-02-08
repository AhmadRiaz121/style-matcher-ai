import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useGeminiApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check if backend has API key configured
  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      setHasApiKey(data.hasApiKey);
    } catch (err) {
      console.error('Failed to check API key status:', err);
      setHasApiKey(false);
    }
  }, []);

  const generateTryOn = useCallback(async (
    profileImage: string,
    clothingImages: string[]
  ): Promise<string | null> => {
    if (!hasApiKey) {
      setError('Server not configured with API key');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert images to base64 if they're URLs
      const profileBase64 = await imageToBase64(profileImage);
      const clothingBase64 = await Promise.all(clothingImages.map(imageToBase64));

      const response = await fetch(`${API_BASE_URL}/api/gemini/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-3-pro-image-preview',
          prompt: `You are a fashion stylist AI. Analyze the person in the first image and the clothing items in the subsequent images. 
                
                Describe in detail how these clothing items would look on this person, including:
                1. How well the colors complement their skin tone
                2. How the style fits their body type
                3. Overall outfit rating (1-10)
                4. Specific styling suggestions
                
                Be detailed and helpful in your fashion advice.`,
          images: [
            {
              data: profileBase64.split(',')[1] || profileBase64,
              mimeType: 'image/jpeg'
            },
            ...clothingBase64.map(img => ({
              data: img.split(',')[1] || img,
              mimeType: 'image/jpeg'
            }))
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate try-on');
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
  }, [hasApiKey]);

  const validateApiKey = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gemini/validate`);
      const data = await response.json();
      return data.valid;
    } catch {
      return false;
    }
  }, []);

  return {
    apiKey: '', // Deprecated: kept for backward compatibility
    setApiKey: () => {}, // Deprecated: API key is now server-side
    isLoading,
    error,
    generateTryOn,
    validateApiKey,
    hasApiKey,
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
