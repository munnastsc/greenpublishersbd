import { sql } from '../db';

export class OrderModel {
  static async getAll() {
    return await sql`SELECT * FROM "Order" ORDER BY id DESC`;
  }

  static async getById(id: number) {
    const res = await sql`SELECT * FROM "Order" WHERE id = ${id}`;
    return res[0] || null;
  }

  static async create(data: any) {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return null;
    const cols = keys.map(k => '"' + k + '"').join(', ');
    const vals = keys.map((_, i) => '$' + (i + 1)).join(', ');
    const params = keys.map(k => data[k]);
    const query = 'INSERT INTO "Order" (' + cols + ') VALUES (' + vals + ') RETURNING *';
    // @ts-ignore
    const result = await sql.query(query, params);
    return result[0];
  }

  static async update(id: number, data: any) {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return null;
    const setClause = keys.map((k, i) => '"' + k + '" = $' + (i + 1)).join(', ');
    const params = [...keys.map(k => data[k]), id];
    const query = 'UPDATE "Order" SET ' + setClause + ' WHERE id = $' + (keys.length + 1) + ' RETURNING *';
    // @ts-ignore
    const result = await sql.query(query, params);
    return result[0];
  }

  static async delete(id: number) {
    await sql`DELETE FROM "Order" WHERE id = ${id}`;
    return { success: true };
  }
}
