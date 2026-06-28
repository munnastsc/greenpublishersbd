import { Request, Response } from 'express';
import axios from 'axios';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export class UpdateController {
  static async checkUpdate(req: Request, res: Response) {
    // In a real scenario, this would check a central API or GitHub releases
    res.json({ updateAvailable: true, version: '1.1.0' });
  }

  static async performUpdate(req: Request, res: Response) {
    try {
      const { updateUrl } = req.body;
      if (!updateUrl) {
        return res.status(400).json({ error: 'Update URL is required' });
      }

      console.log('Downloading update from:', updateUrl);
      const downloadPath = path.join(__dirname, '../../update.zip');
      const extractPath = path.join(__dirname, '../../');

      // 1. Download the ZIP file
      const response = await axios({
        method: 'GET',
        url: updateUrl,
        responseType: 'arraybuffer'
      });
      
      fs.writeFileSync(downloadPath, response.data);

      // 2. Extract the ZIP file
      console.log('Extracting update...');
      const zip = new AdmZip(downloadPath);
      zip.extractAllTo(extractPath, true); // true = overwrite existing files

      // 3. Cleanup the ZIP file
      fs.unlinkSync(downloadPath);

      // 4. Restart Passenger Node app (cPanel specific)
      const restartFile = path.join(__dirname, '../../tmp/restart.txt');
      if (fs.existsSync(path.join(__dirname, '../../tmp'))) {
        fs.writeFileSync(restartFile, new Date().toString());
      }

      res.json({ success: true, message: 'System updated successfully. Restarting...' });
    } catch (error) {
      console.error('Update failed:', error);
      res.status(500).json({ error: 'Failed to perform update' });
    }
  }
}
