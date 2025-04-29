import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveTranslation } from '../../lib/db';
import { verifyAuth } from '../../lib/auth';
import crypto from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to get language code
function getLanguageCode(fullLanguageName) {
  // Extract the language code from the full name (e.g., "English (American)" -> "en")
  return fullLanguageName.split(' ')[0].toLowerCase();
}

export async function POST(request) {
  try {
    const { text, targetLanguage, image } = await request.json();
    
    if (!text && !image) {
      return new Response(JSON.stringify({ error: 'No text or image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth token if available
    const user = await verifyAuth();
    console.log('Auth user:', user); // Debug log

    // Extract language code for Gemini API
    const targetLangCode = getLanguageCode(targetLanguage);

    // Use gemini-2.0-flash for both text and image
    const modelName = image ? 'gemini-2.0-flash' : 'gemini-2.0-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
      let translatedText;
      
      if (image) {
        const imageData = await fetch(image).then(res => res.arrayBuffer());
        const result = await model.generateContent([
          {
            text: `Please translate the text in this image to ${targetLangCode}. If there's no text in the image, please respond with "No text found in the image."`,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: Buffer.from(imageData).toString('base64')
            }
          }
        ]);
        const response = await result.response;
        translatedText = response.text();
      } else {
        const result = await model.generateContent({
          contents: [{
            parts: [{
              text: `Translate the following text to ${targetLangCode}. Only provide the translation without any additional text or explanations:\n\n${text}`
            }]
          }]
        });
        const response = await result.response;
        translatedText = response.text();
      }

      // Save translation if user is authenticated
      if (user) {
        console.log('Saving translation for user:', user.userId); // Debug log
        try {
          const savedTranslation = await saveTranslation({
            id: crypto.randomUUID(),
            sourceText: text || 'Image',
            translatedText,
            sourceLang: 'English (American)',
            targetLang: targetLanguage,
            userId: user.userId
          });
          console.log('Translation saved successfully:', savedTranslation); // Debug log
        } catch (dbError) {
          console.error('Failed to save translation:', dbError);
        }
      }

      return new Response(JSON.stringify({ translatedText }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Translation failed: ' + error.message);
    }
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to translate: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
