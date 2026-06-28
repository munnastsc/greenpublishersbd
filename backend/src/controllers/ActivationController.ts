import { Request, Response } from 'express';
import { ActivationModel } from '../models/ActivationModel';

export class ActivationController {
  static async validate(req: Request, res: Response) {
    try {
      const { code, deviceId } = req.body;
      
      if (!code || !deviceId) {
        return res.status(400).json({ error: 'Code and Device ID are required' });
      }

      const result = await ActivationModel.validateCode(code, deviceId);
      
      if (result.valid) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error during validation' });
    }
  }
}
