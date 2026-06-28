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
  static async getAll(req: Request, res: Response) {
    try {
      const records = await ActivationModel.getAll();
      res.json(records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const record = await ActivationModel.getById(Number(req.params.id));
      if (record) res.json(record);
      else res.status(404).json({ error: 'Not found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const record = await ActivationModel.create(req.body);
      res.json(record);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const record = await ActivationModel.update(Number(req.params.id), req.body);
      if (record) res.json(record);
      else res.status(404).json({ error: 'Not found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ActivationModel.delete(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}
