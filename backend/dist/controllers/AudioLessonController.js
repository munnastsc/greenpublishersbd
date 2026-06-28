"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioLessonController = void 0;
const AudioLessonModel_1 = require("../models/AudioLessonModel");
class AudioLessonController {
    static async getAll(req, res) {
        try {
            const items = await AudioLessonModel_1.AudioLessonModel.getAll();
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
            const item = await AudioLessonModel_1.AudioLessonModel.getById(id);
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
            const item = await AudioLessonModel_1.AudioLessonModel.create(req.body);
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
            const item = await AudioLessonModel_1.AudioLessonModel.update(id, updateData);
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
            await AudioLessonModel_1.AudioLessonModel.delete(id);
            res.json({ message: 'Deleted successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete item' });
        }
    }
}
exports.AudioLessonController = AudioLessonController;
