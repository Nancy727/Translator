import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../../../lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email?.trim() || !password?.trim()) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive data
    const { password: _, ...safeUser } = user;

    return new Response(JSON.stringify({ 
      user: safeUser,
      token
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred during login' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}