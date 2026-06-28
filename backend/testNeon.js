const { sql } = require('./src/db');
async function test() {
  try {
    const res = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Order'
    `;
    console.log(res);
  } catch(e) {
    console.error(e.message);
  }
}
test();
