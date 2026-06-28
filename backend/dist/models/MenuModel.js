"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModel = void 0;
const db_1 = require("../db");
class MenuModel {
    static async getAllMenus() {
        try {
            const menus = await (0, db_1.sql) `SELECT * FROM "MenuItem" ORDER BY "order" ASC`;
            return menus;
        }
        catch (error) {
            console.error('Error fetching menus:', error);
            throw error;
        }
    }
    static async createMenu(data) {
        try {
            const order = data.order || 0;
            const result = await (0, db_1.sql) `
        INSERT INTO "MenuItem" ("labelEn", "labelBn", "url", "order", "createdAt")
        VALUES (${data.labelEn}, ${data.labelBn}, ${data.url}, ${order}, NOW())
        RETURNING *
      `;
            return result[0];
        }
        catch (error) {
            console.error('Error creating menu:', error);
            throw error;
        }
    }
    static async updateMenu(id, data) {
        try {
            // Very basic dynamic update for raw SQL
            if (data.labelEn)
                await (0, db_1.sql) `UPDATE "MenuItem" SET "labelEn" = ${data.labelEn} WHERE id = ${id}`;
            if (data.labelBn)
                await (0, db_1.sql) `UPDATE "MenuItem" SET "labelBn" = ${data.labelBn} WHERE id = ${id}`;
            if (data.url)
                await (0, db_1.sql) `UPDATE "MenuItem" SET "url" = ${data.url} WHERE id = ${id}`;
            if (data.order !== undefined)
                await (0, db_1.sql) `UPDATE "MenuItem" SET "order" = ${data.order} WHERE id = ${id}`;
            const updated = await (0, db_1.sql) `SELECT * FROM "MenuItem" WHERE id = ${id}`;
            return updated[0];
        }
        catch (error) {
            console.error('Error updating menu:', error);
            throw error;
        }
    }
    static async deleteMenu(id) {
        try {
            await (0, db_1.sql) `DELETE FROM "MenuItem" WHERE id = ${id}`;
            return { success: true };
        }
        catch (error) {
            console.error('Error deleting menu:', error);
            throw error;
        }
    }
}
exports.MenuModel = MenuModel;
