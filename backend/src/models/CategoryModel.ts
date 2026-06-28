import { sql } from '../db';

export interface Category {
  id: number;
  nameEn: string;
  nameBn: string;
  createdAt: Date;
}

export class CategoryModel {
  static async getAllCategories(): Promise<Category[]> {
    const categories = await sql`SELECT * FROM "Category" ORDER BY id ASC`;
    return categories as Category[];
  }

  static async getCategoryById(id: number): Promise<Category | null> {
    const categories = await sql`SELECT * FROM "Category" WHERE id = ${id}`;
    return (categories[0] as Category) || null;
  }

  static async createCategory(data: { nameEn: string; nameBn: string }) {
    const result = await sql`
      INSERT INTO "Category" ("nameEn", "nameBn", "createdAt")
      VALUES (${data.nameEn}, ${data.nameBn}, NOW())
      RETURNING *
    `;
    return result[0];
  }

  static async updateCategory(id: number, data: Partial<Category>) {
    if (data.nameEn) await sql`UPDATE "Category" SET "nameEn" = ${data.nameEn} WHERE id = ${id}`;
    if (data.nameBn) await sql`UPDATE "Category" SET "nameBn" = ${data.nameBn} WHERE id = ${id}`;
    
    const updated = await sql`SELECT * FROM "Category" WHERE id = ${id}`;
    return updated[0];
  }

  static async deleteCategory(id: number) {
    await sql`DELETE FROM "Category" WHERE id = ${id}`;
    return { success: true };
  }
}
