# Testing Instructions

## How to Test the App

### 1. Adding Your Gemini API Key

1. Open the file: `d:\UNIVERSITY WORK\SIDES\Style AI\style-matcher-ai\.env`
2. Replace `your_actual_api_key_here` with your Gemini API key:
   ```
   PORT=3001
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   ```
3. Restart the backend server:
   - Open a new terminal
   - Run: `cd style-matcher-ai; npm run server`
4. Refresh the browser

Once done, the "Add API Key" prompts will disappear!

---

### 2. Loading Sample Data

1. Go to the **Settings** tab in the app
2. Scroll down to the **"Sample Data"** section (indigo blue box)
3. Click **"Load Sample Wardrobe"** button
4. The page will refresh with:
   - 12 South Asian clothing items (Shalwar Kameez, Anarkali, Dupatta, etc.)
   - A profile photo of a woman for virtual try-on

---

### 3. Manually Testing Add Clothing Feature

To test adding a clothing item yourself:

1. **Download a test image**:
   - Open this link: https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80
   - Right-click → "Save image as..." → Save to your computer

2. **Add it to the wardrobe**:
   - Go to the **Wardrobe** tab
   - Click **"Add Item"** button
   - Upload the saved image
   - AI will auto-categorize it (if API key is configured)
   - Fill in the details and click **"Add Item"**

3. **Test Virtual Try-On**:
   - Go to the **Try On** tab
   - Your profile photo is already loaded (from sample data)
   - Select some clothing items from below
   - Click **"Generate Style Analysis"**

---

## Alternative Test Images

If you want to test with different items:

- **Shalwar Kameez**: https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800
- **Embroidered Shawl**: https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800
- **Dupatta**: https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800
- **Anarkali Dress**: https://images.unsplash.com/photo-1583391733981-e8c2e6b0f6e3?w=800

---

## Troubleshooting

**If API key prompts still show:**
- Make sure `.env` file has the correct API key
- Backend server must be running on port 3001
- Frontend should be on port 8080 or 8081

**If sample data doesn't load:**
- Check browser console for errors (F12)
- Reload the page manually

**If images don't upload:**
- Ensure the image is in JPG or PNG format
- Try a smaller image (< 5MB)
