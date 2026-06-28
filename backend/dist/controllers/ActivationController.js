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
}
exports.ActivationController = ActivationController;
