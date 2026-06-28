"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const MediaModel_1 = require("../models/MediaModel");
class MediaController {
    static async getVideos(req, res) {
        try {
            const videos = await MediaModel_1.MediaModel.getAllVideos();
            res.json(videos);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch videos' });
        }
    }
    static async getAudio(req, res) {
        try {
            const audio = await MediaModel_1.MediaModel.getAllAudio();
            res.json(audio);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch audio lessons' });
        }
    }
    static async getEducationTools(req, res) {
        try {
            const tools = await MediaModel_1.MediaModel.getEducationTools();
            res.json(tools);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch education tools' });
        }
    }
    static async getTrainingManuals(req, res) {
        try {
            const manuals = await MediaModel_1.MediaModel.getTrainingManuals();
            res.json(manuals);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch training manuals' });
        }
    }
}
exports.MediaController = MediaController;
