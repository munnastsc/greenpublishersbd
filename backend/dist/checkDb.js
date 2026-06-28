"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function check() {
    const tables = await (0, db_1.sql) `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
    console.log(tables.map(t => t.table_name));
    process.exit(0);
}
check().catch(console.error);
