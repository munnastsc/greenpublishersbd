import { Request, Response } from 'express';
import { HomeSectionModel } from '../models/HomeSectionModel';

export class HomeSectionController {
  static async getAll(req: Request, res: Response) {
    try {
      const items = await HomeSectionModel.getAll();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await HomeSectionModel.getById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const item = await HomeSectionModel.create(req.body);
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
      const item = await HomeSectionModel.update(id, updateData);
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await HomeSectionModel.delete(id);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
}
