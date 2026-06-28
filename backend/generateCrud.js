const fs = require('fs');
const path = require('path');

const entities = [
  'Author', 'Publisher', 'Unit', 'Order', 'Coupon', 'User', 
  'HomeSection', 'MenuItem', 'EducationalMaterial', 'TrainingManual', 
  'CustomPage', 'Banner', 'Video', 'AudioLesson'
];

const modelsDir = path.join(__dirname, 'src', 'models');
const controllersDir = path.join(__dirname, 'src', 'controllers');

if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });

entities.forEach(entity => {
  const modelContent = `import { sql } from '../db';

export class ${entity}Model {
  static async getAll() {
    return await sql\`SELECT * FROM "${entity}" ORDER BY id DESC\`;
  }

  static async getById(id: number) {
    const res = await sql\`SELECT * FROM "${entity}" WHERE id = \${id}\`;
    return res[0] || null;
  }

  static async create(data: any) {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return null;
    const cols = keys.map(k => '"' + k + '"').join(', ');
    const vals = keys.map((_, i) => '$' + (i + 1)).join(', ');
    const params = keys.map(k => data[k]);
    const query = 'INSERT INTO "${entity}" (' + cols + ') VALUES (' + vals + ') RETURNING *';
    // @ts-ignore
    const result = await sql.query(query, params);
    return result[0];
  }

  static async update(id: number, data: any) {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return null;
    const setClause = keys.map((k, i) => '"' + k + '" = $' + (i + 1)).join(', ');
    const params = [...keys.map(k => data[k]), id];
    const query = 'UPDATE "${entity}" SET ' + setClause + ' WHERE id = $' + (keys.length + 1) + ' RETURNING *';
    // @ts-ignore
    const result = await sql.query(query, params);
    return result[0];
  }

  static async delete(id: number) {
    await sql\`DELETE FROM "${entity}" WHERE id = \${id}\`;
    return { success: true };
  }
}
`;

  const controllerContent = `import { Request, Response } from 'express';
import { ${entity}Model } from '../models/${entity}Model';

export class ${entity}Controller {
  static async getAll(req: Request, res: Response) {
    try {
      const items = await ${entity}Model.getAll();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await ${entity}Model.getById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const item = await ${entity}Model.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create item' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { id: _, ...updateData } = req.body;
      const item = await ${entity}Model.update(id, updateData);
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await ${entity}Model.delete(id);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
}
`;

  fs.writeFileSync(path.join(modelsDir, `${entity}Model.ts`), modelContent);
  fs.writeFileSync(path.join(controllersDir, `${entity}Controller.ts`), controllerContent);
});

console.log('CRUD generated successfully.');
