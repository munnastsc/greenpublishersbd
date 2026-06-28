import { Request, Response } from 'express';
import { BookModel } from '../models/BookModel';

export class BookController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const books = await BookModel.getAllBooks(limit);
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id as string);
      const book = await BookModel.getBookById(id);
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch book details' });
    }
  }

  static async getByCategory(req: Request, res: Response) {
    try {
      const categoryId = Number(req.params.categoryId as string);
      const books = await BookModel.getBooksByCategory(categoryId);
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books for category' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const book = await BookModel.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create book' });
    }
  }
  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id as string);
      const { id: _, ...data } = req.body;
      const book = await BookModel.updateBook(id, data);
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update book' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id as string);
      await BookModel.deleteBook(id);
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete book' });
    }
  }
}
