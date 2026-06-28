import { sql } from './src/db';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'admin@greenpublishers.com';
  const password = 'bdgreen.2026@';
  
  // Check if admin already exists
  const existing = await sql`SELECT id FROM "User" WHERE email = ${email}`;
  
  if (existing.length === 0) {
    const hashed = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO "User" ("name", "email", "password", "role", "createdAt")
      VALUES ('Super Admin', ${email}, ${hashed}, 'ADMIN', NOW())
    `;
    console.log(`Created admin user: ${email} / ${password}`);
  } else {
    // Force update password to 'admin'
    const hashed = await bcrypt.hash(password, 10);
    await sql`UPDATE "User" SET password = ${hashed}, role = 'ADMIN' WHERE email = ${email}`;
    console.log(`Updated existing admin user: ${email} / ${password}`);
  }
  process.exit(0);
}

main().catch(console.error);
