"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateController = void 0;
const axios_1 = __importDefault(require("axios"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class UpdateController {
    static async checkUpdate(req, res) {
        // In a real scenario, this would check a central API or GitHub releases
        res.json({ updateAvailable: true, version: '1.1.0' });
    }
    static async performUpdate(req, res) {
        try {
            const { updateUrl } = req.body;
            if (!updateUrl) {
                return res.status(400).json({ error: 'Update URL is required' });
            }
            console.log('Downloading update from:', updateUrl);
            const downloadPath = path_1.default.join(__dirname, '../../update.zip');
            const extractPath = path_1.default.join(__dirname, '../../');
            // 1. Download the ZIP file
            const response = await (0, axios_1.default)({
                method: 'GET',
                url: updateUrl,
                responseType: 'arraybuffer'
            });
            fs_1.default.writeFileSync(downloadPath, response.data);
            // 2. Extract the ZIP file
            console.log('Extracting update...');
            const zip = new adm_zip_1.default(downloadPath);
            zip.extractAllTo(extractPath, true); // true = overwrite existing files
            // 3. Cleanup the ZIP file
            fs_1.default.unlinkSync(downloadPath);
            // 4. Restart Passenger Node app (cPanel specific)
            const restartFile = path_1.default.join(__dirname, '../../tmp/restart.txt');
            if (fs_1.default.existsSync(path_1.default.join(__dirname, '../../tmp'))) {
                fs_1.default.writeFileSync(restartFile, new Date().toString());
            }
            res.json({ success: true, message: 'System updated successfully. Restarting...' });
        }
        catch (error) {
            console.error('Update failed:', error);
            res.status(500).json({ error: 'Failed to perform update' });
        }
    }
}
exports.UpdateController = UpdateController;
