import { Request, Response } from 'express';
import { MediaModel } from '../models/MediaModel';

export class MediaController {
  static async getVideos(req: Request, res: Response) {
    try {
      const videos = await MediaModel.getAllVideos();
      res.json(videos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  }

  static async getAudio(req: Request, res: Response) {
    try {
      const audio = await MediaModel.getAllAudio();
      res.json(audio);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch audio lessons' });
    }
  }

  static async getEducationTools(req: Request, res: Response) {
    try {
      const tools = await MediaModel.getEducationTools();
      res.json(tools);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch education tools' });
    }
  }

  static async getTrainingManuals(req: Request, res: Response) {
    try {
      const manuals = await MediaModel.getTrainingManuals();
      res.json(manuals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch training manuals' });
    }
  }
}
