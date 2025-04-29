const GEMINI_API_KEY = "AIzaSyC4KnJ7GAZJACW6oCK0-cBydSxnVR8rrCg";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function getGeminiResponse(prompt) {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from Gemini API');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
  }
} 