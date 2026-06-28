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
    static async bulkGenerate(req, res) {
        try {
            const count = parseInt(req.body.count, 10);
            if (!count || count <= 0) {
                return res.status(400).json({ error: 'Invalid count' });
            }
            const result = await ActivationModel_1.ActivationModel.bulkCreate(count);
            res.json({ success: true, message: `Generated ${result.generated} codes.` });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error during bulk generate' });
        }
    }
    static async exportCsv(req, res) {
        try {
            const records = await ActivationModel_1.ActivationModel.exportUnused();
            let csv = 'Code,Created At\n';
            records.forEach((r) => {
                csv += `${r.code},${r.createdAt.toISOString()}\n`;
            });
            res.header('Content-Type', 'text/csv');
            res.attachment('unused_activation_codes.csv');
            return res.send(csv);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error during export' });
        }
    }
}
exports.ActivationController = ActivationController;
