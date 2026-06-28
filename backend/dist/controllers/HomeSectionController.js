"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionController = void 0;
const HomeSectionModel_1 = require("../models/HomeSectionModel");
class HomeSectionController {
    static async getAll(req, res) {
        try {
            const items = await HomeSectionModel_1.HomeSectionModel.getAll();
            res.json(items);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch items' });
        }
    }
    static async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const item = await HomeSectionModel_1.HomeSectionModel.getById(id);
            if (!item)
                return res.status(404).json({ error: 'Not found' });
            res.json(item);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch item' });
        }
    }
    static async create(req, res) {
        try {
            const item = await HomeSectionModel_1.HomeSectionModel.create(req.body);
            res.status(201).json(item);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create item' });
        }
    }
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const { id: _, ...updateData } = req.body;
            const item = await HomeSectionModel_1.HomeSectionModel.update(id, updateData);
            res.json(item);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update item' });
        }
    }
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await HomeSectionModel_1.HomeSectionModel.delete(id);
            res.json({ message: 'Deleted successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete item' });
        }
    }
}
exports.HomeSectionController = HomeSectionController;
