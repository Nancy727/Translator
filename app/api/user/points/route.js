import { verifyAuth } from '../../../lib/auth';
import { getUserPoints } from '../../../lib/db';

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const points = await getUserPoints(user.userId);

    return new Response(JSON.stringify({ points }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user points:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user points' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}