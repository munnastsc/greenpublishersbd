"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const db_1 = require("../db");
class BookModel {
    static async getAllBooks(limit = 50) {
        // Join with Category and Author to get their names
        const books = await (0, db_1.sql) `
      SELECT 
        b.*, 
        json_build_object('id', a.id, 'nameEn', a."nameEn", 'nameBn', a."nameBn") as author,
        json_build_object('id', c.id, 'nameEn', c."nameEn", 'nameBn', c."nameBn") as category,
        json_build_object('id', p.id, 'nameEn', p."nameEn", 'nameBn', p."nameBn") as publisher
      FROM "Book" b
      LEFT JOIN "Author" a ON b."authorId" = a.id
      LEFT JOIN "Category" c ON b."categoryId" = c.id
      LEFT JOIN "Publisher" p ON b."publisherId" = p.id
      ORDER BY 
        CASE 
          WHEN p."nameEn" ILIKE '%Green%' OR p."nameBn" LIKE '%গ্রীন%' THEN 0 
          ELSE 1 
        END ASC,
        b."createdAt" DESC
      LIMIT ${limit}
    `;
        return books;
    }
    static async getBookById(id) {
        const books = await (0, db_1.sql) `
      SELECT 
        b.*, 
        json_build_object('id', a.id, 'nameEn', a."nameEn", 'nameBn', a."nameBn") as author,
        json_build_object('id', c.id, 'nameEn', c."nameEn", 'nameBn', c."nameBn") as category,
        json_build_object('id', p.id, 'nameEn', p."nameEn", 'nameBn', p."nameBn") as publisher
      FROM "Book" b
      LEFT JOIN "Author" a ON b."authorId" = a.id
      LEFT JOIN "Category" c ON b."categoryId" = c.id
      LEFT JOIN "Publisher" p ON b."publisherId" = p.id
      WHERE b.id = ${id}
    `;
        return books[0] || null;
    }
    static async getBooksByCategory(categoryId, limit = 12) {
        const books = await (0, db_1.sql) `
      SELECT 
        b.*, 
        json_build_object('id', a.id, 'nameEn', a."nameEn", 'nameBn', a."nameBn") as author
      FROM "Book" b
      LEFT JOIN "Author" a ON b."authorId" = a.id
      WHERE b."categoryId" = ${categoryId}
      ORDER BY b."createdAt" DESC
      LIMIT ${limit}
    `;
        return books;
    }
    static async createBook(data) {
        const result = await (0, db_1.sql) `
      INSERT INTO "Book" (
        "titleEn", "titleBn", "description", "price", "originalPrice", 
        "imageUrl", "rokomariLink", "categoryId", "authorId", "publisherId", 
        "createdAt", "updatedAt"
      )
      VALUES (
        ${data.titleEn}, ${data.titleBn}, ${data.description || null}, ${data.price}, ${data.originalPrice || null},
        ${data.imageUrl || null}, ${data.rokomariLink || null}, ${data.categoryId || null}, ${data.authorId || null}, ${data.publisherId || null},
        NOW(), NOW()
      )
      RETURNING *
    `;
        return result[0];
    }
    static async updateBook(id, data) {
        const keys = Object.keys(data).filter(k => k !== 'id');
        if (keys.length === 0)
            return null;
        const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
        const params = [...keys.map(k => data[k]), id];
        const query = `UPDATE "Book" SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
        // @ts-ignore
        const result = await db_1.sql.query(query, params);
        return result[0];
    }
    static async deleteBook(id) {
        await (0, db_1.sql) `DELETE FROM "Book" WHERE id = ${id}`;
        return { success: true };
    }
}
exports.BookModel = BookModel;
