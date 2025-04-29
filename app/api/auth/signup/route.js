import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../../../lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with a unique ID
    const user = await createUser({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create account' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}