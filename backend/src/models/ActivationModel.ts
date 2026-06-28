import { sql } from '../db';

export class ActivationModel {
  static async validateCode(code: string, deviceId: string) {
    // Check if code exists and is unused
    const records = await sql`SELECT * FROM "ActivationCode" WHERE code = ${code}`;
    
    if (records.length === 0) {
      return { valid: false, error: 'Invalid activation code' };
    }

    const record = records[0];

    if (record.isUsed) {
      // If used, check if it's the same device
      if (record.deviceId === deviceId) {
        return { valid: true };
      } else {
        return { valid: false, error: 'Code already used on another device' };
      }
    }

    // Mark as used
    await sql`
      UPDATE "ActivationCode" 
      SET "isUsed" = true, "usedAt" = NOW(), "deviceId" = ${deviceId} 
      WHERE id = ${record.id}
    `;

    return { valid: true };
  }
  static async getAll() {
    return await sql`SELECT * FROM "ActivationCode" ORDER BY id DESC`;
  }

  static async getById(id: number) {
    const res = await sql`SELECT * FROM "ActivationCode" WHERE id = ${id}`;
    return res[0] || null;
  }

  static async create(data: any) {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return null;
    const cols = keys.map(k => '"' + k + '"').join(', ');
    const vals = keys.map((_, i) => '$' + (i + 1)).join(', ');
    const params = keys.map(k => data[k]);
    const query = 'INSERT INTO "ActivationCode" (' + cols + ') VALUES (' + vals + ') RETURNING *';
    // @ts-ignore
    const result = await sql.query(query, params);
    return result[0];
  }

  static async update(id: number, data: any) {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return null;
    const setClause = keys.map((k, i) => '"' + k + '" = $' + (i + 1)).join(', ');
    const params = [...keys.map(k => data[k]), id];
    const query = 'UPDATE "ActivationCode" SET ' + setClause + ' WHERE id = $' + (keys.length + 1) + ' RETURNING *';
    // @ts-ignore
    const result = await sql.query(query, params);
    return result[0];
  }

  static async delete(id: number) {
    await sql`DELETE FROM "ActivationCode" WHERE id = ${id}`;
    return { success: true };
  }
}
