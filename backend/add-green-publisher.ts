import { sql } from './src/db';

async function main() {
  // Check if Green Publishers exists
  const existing = await sql`SELECT id FROM "Publisher" WHERE "nameEn" = 'Green Publishers'`;
  let greenPubId;
  
  if (existing.length > 0) {
    greenPubId = existing[0].id;
  } else {
    const pub = await sql`
      INSERT INTO "Publisher" ("nameEn", "nameBn", "createdAt")
      VALUES ('Green Publishers', 'গ্রীন পাবলিশার্স', NOW())
      RETURNING id
    `;
    greenPubId = pub[0].id;
  }

  // Insert exactly 3 books specifically named Green Publishers Book
  await sql`
    INSERT INTO "Book" (
      "titleEn", "titleBn", "price", "categoryId", "publisherId", "createdAt", "updatedAt"
    ) VALUES
    ('Green Book 1', 'গ্রীন বই ১', 200, (SELECT id FROM "Category" LIMIT 1), ${greenPubId}, NOW(), NOW()),
    ('Green Book 2', 'গ্রীন বই ২', 300, (SELECT id FROM "Category" LIMIT 1), ${greenPubId}, NOW(), NOW()),
    ('Green Book 3', 'গ্রীন বই ৩', 250, (SELECT id FROM "Category" LIMIT 1), ${greenPubId}, NOW(), NOW())
  `;

  // Also update a couple of existing books to be Green Publishers
  const existingBooks = await sql`SELECT id FROM "Book" ORDER BY id ASC LIMIT 3`;
  for (const b of existingBooks) {
    await sql`UPDATE "Book" SET "publisherId" = ${greenPubId} WHERE id = ${b.id}`;
  }

  console.log("Done adding Green Publishers books!");
  process.exit(0);
}

main().catch(console.error);
