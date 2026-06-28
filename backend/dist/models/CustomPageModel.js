"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPageModel = void 0;
const db_1 = require("../db");
class CustomPageModel {
    static async getAll() {
        return await (0, db_1.sql) `SELECT * FROM "CustomPage" ORDER BY id DESC`;
    }
    static async getById(id) {
        const res = await (0, db_1.sql) `SELECT * FROM "CustomPage" WHERE id = ${id}`;
        return res[0] || null;
    }
    static async create(data) {
        const keys = Object.keys(data).filter(k => k !== 'id');
        if (keys.length === 0)
            return null;
        const cols = keys.map(k => '"' + k + '"').join(', ');
        const vals = keys.map((_, i) => '$' + (i + 1)).join(', ');
        const params = keys.map(k => data[k]);
        const query = 'INSERT INTO "CustomPage" (' + cols + ') VALUES (' + vals + ') RETURNING *';
        const result = await db_1.sql(query);
        return result[0];
    }
    static async update(id, data) {
        const keys = Object.keys(data).filter(k => k !== 'id');
        if (keys.length === 0)
            return null;
        const setClause = keys.map((k, i) => '"' + k + '" = $' + (i + 1)).join(', ');
        const params = [...keys.map(k => data[k]), id];
        const query = 'UPDATE "CustomPage" SET ' + setClause + ' WHERE id = $' + (keys.length + 1) + ' RETURNING *';
        const result = await db_1.sql(query);
        return result[0];
    }
    static async delete(id) {
        await (0, db_1.sql) `DELETE FROM "CustomPage" WHERE id = ${id}`;
        return { success: true };
    }
}
exports.CustomPageModel = CustomPageModel;
