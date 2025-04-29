import { getUserTranslations } from '../../lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    // Get the authorization header
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const translations = await getUserTranslations(decoded.userId);
      
      return new Response(JSON.stringify({ translations }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching translations:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch translations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}