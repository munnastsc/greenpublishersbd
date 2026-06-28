import { sql } from '../db';

export class MediaModel {
  static async getAllVideos() {
    // Left join with Book and Unit
    const videos = await sql`
      SELECT 
        v.*,
        json_build_object('id', b.id, 'titleEn', b."titleEn", 'titleBn', b."titleBn", 'imageUrl', b."imageUrl") AS book,
        json_build_object('id', u.id, 'titleEn', u."titleEn", 'titleBn', u."titleBn", 'order', u."order") AS unit
      FROM "Video" v
      LEFT JOIN "Book" b ON v."bookId" = b.id
      LEFT JOIN "Unit" u ON v."unitId" = u.id
      ORDER BY v."bookId" ASC, v."createdAt" DESC
    `;
    
    // Clean up null JSON objects
    return videos.map(v => ({
      ...v,
      book: v.book.id === null ? null : v.book,
      unit: v.unit.id === null ? null : v.unit
    }));
  }

  static async getAllAudio() {
    // Left join with Book and Unit
    const audio = await sql`
      SELECT 
        a.*,
        json_build_object('id', b.id, 'titleEn', b."titleEn", 'titleBn', b."titleBn", 'imageUrl', b."imageUrl") AS book,
        json_build_object('id', u.id, 'titleEn', u."titleEn", 'titleBn', u."titleBn", 'order', u."order") AS unit
      FROM "AudioLesson" a
      LEFT JOIN "Book" b ON a."bookId" = b.id
      LEFT JOIN "Unit" u ON a."unitId" = u.id
      ORDER BY a."bookId" ASC, a."unitId" ASC, a."sortOrder" ASC, a."createdAt" ASC
    `;
    
    // Clean up null JSON objects
    return audio.map(a => ({
      ...a,
      book: a.book.id === null ? null : a.book,
      unit: a.unit.id === null ? null : a.unit
    }));
  }

  static async getEducationTools() {
    return await sql`SELECT * FROM "EducationalMaterial" ORDER BY "sortOrder" ASC, "createdAt" DESC`;
  }

  static async getTrainingManuals() {
    return await sql`SELECT * FROM "TrainingManual" ORDER BY "sortOrder" ASC, "createdAt" DESC`;
  }
}
