"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationModel = void 0;
const db_1 = require("../db");
class ActivationModel {
    static async validateCode(code, deviceId) {
        // Check if code exists and is unused
        const records = await (0, db_1.sql) `SELECT * FROM "ActivationCode" WHERE code = ${code}`;
        if (records.length === 0) {
            return { valid: false, error: 'Invalid activation code' };
        }
        const record = records[0];
        if (record.isUsed) {
            // If used, check if it's the same device
            if (record.deviceId === deviceId) {
                return { valid: true };
            }
            else {
                return { valid: false, error: 'Code already used on another device' };
            }
        }
        // Mark as used
        await (0, db_1.sql) `
      UPDATE "ActivationCode" 
      SET "isUsed" = true, "usedAt" = NOW(), "deviceId" = ${deviceId} 
      WHERE id = ${record.id}
    `;
        return { valid: true };
    }
}
exports.ActivationModel = ActivationModel;
