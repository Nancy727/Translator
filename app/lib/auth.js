import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getAuthToken() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

export async function verifyAuth() {
  // For now, we'll return a mock user
  // In a real application, you would verify the user's session/token here
  return {
    user: {
      id: 'mock-user-id',
      email: 'mock@example.com'
    }
  };
}

export function authMiddleware(handler) {
  return async function(request) {
    const user = await verifyAuth();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Add user to request context
    request.user = user;
    return handler(request);
  };
}

export function withOptionalAuth(handler) {
  return async function(request) {
    const user = await verifyAuth();
    request.user = user;
    return handler(request);
  };
}