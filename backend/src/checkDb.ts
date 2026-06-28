import { sql } from './db';

async function check() {
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log(tables.map(t => t.table_name));
  process.exit(0);
}

check().catch(console.error);
