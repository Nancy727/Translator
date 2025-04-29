import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const filename = `${uuidv4()}.wav`;
    const path = join(process.cwd(), 'public', 'uploads', filename);
    
    // Save the file
    await writeFile(path, buffer);

    // Return the URL for the saved file
    return NextResponse.json({
      audioUrl: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    return NextResponse.json(
      { error: 'Failed to upload audio' },
      { status: 500 }
    );
  }
} 