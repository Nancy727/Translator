import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyC4KnJ7GAZJACW6oCK0-cBydSxnVR8rrCg");

export async function POST(request) {
  try {
    const { text, targetLanguage, image } = await request.json();
    
    if (!text && !image) {
      return new Response(JSON.stringify({ error: 'No text or image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    if (image) {
      const imageData = await fetch(image).then(res => res.arrayBuffer());
      const result = await model.generateContent({
        contents: [{
          parts: [
            {
              text: `Please translate the text in this image to ${targetLanguage}. If there's no text in the image, please respond with "No text found in the image."`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: Buffer.from(imageData).toString('base64')
              }
            }
          ]
        }]
      });
      const response = await result.response;
      return new Response(JSON.stringify({ translatedText: response.text() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const result = await model.generateContent(
        `Translate the following text to ${targetLanguage}. Only provide the translation without any additional text or explanations:\n\n${text}`
      );
      const response = await result.response;
      return new Response(JSON.stringify({ translatedText: response.text() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ error: 'Translation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 
