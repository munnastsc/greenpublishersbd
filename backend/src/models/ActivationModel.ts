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
    return await sql`SELECT * FROM "ActivationCode" ORDER BY id DESC LIMIT 500`;
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

  static generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async bulkCreate(count: number) {
    const limit = Math.min(count, 15000); // Max 15000 per batch to be safe with postgres params
    const codes = new Set<string>();
    
    while (codes.size < limit) {
      codes.add(this.generateRandomCode(8));
    }

    const codeArray = Array.from(codes);
    const valuesClause = codeArray.map((_, i) => `($${i + 1})`).join(', ');
    
    const query = `INSERT INTO "ActivationCode" (code) VALUES ${valuesClause} ON CONFLICT (code) DO NOTHING`;
    
    // @ts-ignore
    await sql.query(query, codeArray);
    
    return { generated: codeArray.length };
  }

  static async exportUnused() {
    const res = await sql`SELECT code, "createdAt" FROM "ActivationCode" WHERE "isUsed" = false ORDER BY id DESC`;
    return res;
  }
}
