"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationController = void 0;
const ActivationModel_1 = require("../models/ActivationModel");
class ActivationController {
    static async validate(req, res) {
        try {
            const { code, deviceId } = req.body;
            if (!code || !deviceId) {
                return res.status(400).json({ error: 'Code and Device ID are required' });
            }
            const result = await ActivationModel_1.ActivationModel.validateCode(code, deviceId);
            if (result.valid) {
                res.json({ success: true });
            }
            else {
                res.status(400).json({ error: result.error });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error during validation' });
        }
    }
    static async getAll(req, res) {
        try {
            const records = await ActivationModel_1.ActivationModel.getAll();
            res.json(records);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getById(req, res) {
        try {
            const record = await ActivationModel_1.ActivationModel.getById(Number(req.params.id));
            if (record)
                res.json(record);
            else
                res.status(404).json({ error: 'Not found' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async create(req, res) {
        try {
            const record = await ActivationModel_1.ActivationModel.create(req.body);
            res.json(record);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async update(req, res) {
        try {
            const record = await ActivationModel_1.ActivationModel.update(Number(req.params.id), req.body);
            if (record)
                res.json(record);
            else
                res.status(404).json({ error: 'Not found' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async delete(req, res) {
        try {
            await ActivationModel_1.ActivationModel.delete(Number(req.params.id));
            res.json({ success: true });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}
exports.ActivationController = ActivationController;
