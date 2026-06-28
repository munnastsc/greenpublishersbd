"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const CategoryModel_1 = require("../models/CategoryModel");
class CategoryController {
    static async getAll(req, res) {
        try {
            const categories = await CategoryModel_1.CategoryModel.getAllCategories();
            res.json(categories);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }
    static async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const category = await CategoryModel_1.CategoryModel.getCategoryById(id);
            if (!category)
                return res.status(404).json({ error: 'Category not found' });
            res.json(category);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    }
    static async create(req, res) {
        try {
            const category = await CategoryModel_1.CategoryModel.createCategory(req.body);
            res.status(201).json(category);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create category' });
        }
    }
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const category = await CategoryModel_1.CategoryModel.updateCategory(id, req.body);
            res.json(category);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update category' });
        }
    }
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await CategoryModel_1.CategoryModel.deleteCategory(id);
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete category' });
        }
    }
}
exports.CategoryController = CategoryController;
