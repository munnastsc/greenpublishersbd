const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_tWon1c9kTxOI@ep-wild-resonance-aofxn2s5.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function run() {
  const codes = await sql`SELECT * FROM "ActivationCode" LIMIT 5`;
  console.log(codes);
}
run();
