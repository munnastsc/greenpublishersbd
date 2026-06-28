"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const db_1 = require("../db");
class CategoryModel {
    static async getAllCategories() {
        const categories = await (0, db_1.sql) `SELECT * FROM "Category" ORDER BY id ASC`;
        return categories;
    }
    static async getCategoryById(id) {
        const categories = await (0, db_1.sql) `SELECT * FROM "Category" WHERE id = ${id}`;
        return categories[0] || null;
    }
    static async createCategory(data) {
        const result = await (0, db_1.sql) `
      INSERT INTO "Category" ("nameEn", "nameBn", "createdAt")
      VALUES (${data.nameEn}, ${data.nameBn}, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async updateCategory(id, data) {
        if (data.nameEn)
            await (0, db_1.sql) `UPDATE "Category" SET "nameEn" = ${data.nameEn} WHERE id = ${id}`;
        if (data.nameBn)
            await (0, db_1.sql) `UPDATE "Category" SET "nameBn" = ${data.nameBn} WHERE id = ${id}`;
        const updated = await (0, db_1.sql) `SELECT * FROM "Category" WHERE id = ${id}`;
        return updated[0];
    }
    static async deleteCategory(id) {
        await (0, db_1.sql) `DELETE FROM "Category" WHERE id = ${id}`;
        return { success: true };
    }
}
exports.CategoryModel = CategoryModel;
