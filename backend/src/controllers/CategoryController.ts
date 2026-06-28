import { Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel';

export class CategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryModel.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id as string);
      const category = await CategoryModel.getCategoryById(id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const category = await CategoryModel.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id as string);
      const category = await CategoryModel.updateCategory(id, req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id as string);
      await CategoryModel.deleteCategory(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
}
