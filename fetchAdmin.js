const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_tWon1c9kTxOI@ep-wild-resonance-aofxn2s5.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  const res = await pool.query('SELECT * FROM users WHERE role = $1', ['admin']);
  console.log(res.rows);
  process.exit(0);
}
run();
