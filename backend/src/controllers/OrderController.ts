import { Request, Response } from 'express';
import { OrderModel } from '../models/OrderModel';
import { sendOrderNotification } from '../utils/EmailService';

export class OrderController {
  static async getAll(req: Request, res: Response) {
    try {
      const items = await OrderModel.getAll();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await OrderModel.getById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const item = await OrderModel.create(req.body);
      
      if (item) {
        sendOrderNotification(item).catch(console.error);
      }

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
      const item = await OrderModel.update(id, updateData);
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await OrderModel.delete(id);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
}
