import { neon } from '@neondatabase/serverless';
import pkg from 'pg';
const { Pool } = pkg;

// For direct queries using neon
const sql = neon(process.env.DATABASE_URL);

// For more complex operations using pg Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function findUserByEmail(email) {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return user;
}

export async function createUser({ id, name, email, password }) {
  const [user] = await sql`
    INSERT INTO users (id, name, email, password)
    VALUES (${id}, ${name}, ${email}, ${password})
    RETURNING *
  `;
  return user;
}

export async function saveTranslation({ id, sourceText, translatedText, sourceLang, targetLang, userId }) {
  const [translation] = await sql`
    INSERT INTO translations (id, source_text, translated_text, source_lang, target_lang, user_id)
    VALUES (${id}, ${sourceText}, ${translatedText}, ${sourceLang}, ${targetLang}, ${userId})
    RETURNING *
  `;
  return translation;
}

export async function getUserTranslations(userId) {
  return await sql`
    SELECT * FROM translations 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
}

export async function getUserPoints(userId) {
  const [result] = await sql`
    SELECT points FROM users 
    WHERE id = ${userId}
  `;
  return result?.points || 0;
}

export async function updateUserPoints(userId, points) {
  // In a real application, this would update the user's points in the database
  return points;
}

export default sql;

// Mock SQL template literal tag
export const mockSql = {
  async query(strings, ...values) {
    // In a real application, this would execute SQL queries
    return [];
  }
};