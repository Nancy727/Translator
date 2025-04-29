import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { audioUrl } = await request.json();
    
    // Initialize AssemblyAI
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_detection: true
      })
    });

    const data = await response.json();
    
    // Get the transcription result
    const transcriptResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${data.id}`, {
      headers: {
        'Authorization': process.env.ASSEMBLYAI_API_KEY,
      }
    });

    const transcriptData = await transcriptResponse.json();
    
    return NextResponse.json({
      text: transcriptData.text,
      language: transcriptData.language_code
    });
  } catch (error) {
    console.error('Error in voice transcription:', error);
    return NextResponse.json(
      { error: 'Failed to process voice input' },
      { status: 500 }
    );
  }
} 