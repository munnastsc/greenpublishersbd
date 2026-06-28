"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const BookModel_1 = require("../models/BookModel");
class BookController {
    static async getAll(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            const books = await BookModel_1.BookModel.getAllBooks(limit);
            res.json(books);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch books' });
        }
    }
    static async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const book = await BookModel_1.BookModel.getBookById(id);
            if (!book)
                return res.status(404).json({ error: 'Book not found' });
            res.json(book);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch book details' });
        }
    }
    static async getByCategory(req, res) {
        try {
            const categoryId = Number(req.params.categoryId);
            const books = await BookModel_1.BookModel.getBooksByCategory(categoryId);
            res.json(books);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch books for category' });
        }
    }
    static async create(req, res) {
        try {
            const book = await BookModel_1.BookModel.createBook(req.body);
            res.status(201).json(book);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create book' });
        }
    }
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const { id: _, ...data } = req.body;
            const book = await BookModel_1.BookModel.updateBook(id, data);
            res.json(book);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update book' });
        }
    }
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await BookModel_1.BookModel.deleteBook(id);
            res.json({ message: 'Book deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete book' });
        }
    }
}
exports.BookController = BookController;
