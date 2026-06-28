import { sql } from '../db';

export interface MenuItem {
  id: number;
  labelEn: string;
  labelBn: string;
  url: string;
  order: number;
  createdAt: Date;
}

export class MenuModel {
  static async getAllMenus(): Promise<MenuItem[]> {
    try {
      const menus = await sql`SELECT * FROM "MenuItem" ORDER BY "order" ASC`;
      return menus as MenuItem[];
    } catch (error) {
      console.error('Error fetching menus:', error);
      throw error;
    }
  }

  static async createMenu(data: { labelEn: string; labelBn: string; url: string; order?: number }) {
    try {
      const order = data.order || 0;
      const result = await sql`
        INSERT INTO "MenuItem" ("labelEn", "labelBn", "url", "order", "createdAt")
        VALUES (${data.labelEn}, ${data.labelBn}, ${data.url}, ${order}, NOW())
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }

  static async updateMenu(id: number, data: Partial<MenuItem>) {
    try {
      // Very basic dynamic update for raw SQL
      if (data.labelEn) await sql`UPDATE "MenuItem" SET "labelEn" = ${data.labelEn} WHERE id = ${id}`;
      if (data.labelBn) await sql`UPDATE "MenuItem" SET "labelBn" = ${data.labelBn} WHERE id = ${id}`;
      if (data.url) await sql`UPDATE "MenuItem" SET "url" = ${data.url} WHERE id = ${id}`;
      if (data.order !== undefined) await sql`UPDATE "MenuItem" SET "order" = ${data.order} WHERE id = ${id}`;
      
      const updated = await sql`SELECT * FROM "MenuItem" WHERE id = ${id}`;
      return updated[0];
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  }

  static async deleteMenu(id: number) {
    try {
      await sql`DELETE FROM "MenuItem" WHERE id = ${id}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw error;
    }
  }
}
