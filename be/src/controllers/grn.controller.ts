import { Request, Response, NextFunction } from 'express';
import { grnSchema } from '../validators/grn.schema';
import * as grnService from '../services/grn.service';

export async function createGRN(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = grnSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.flatten());
    }

    const grnId = await grnService.createGRN(parsed.data);
    res.status(201).json({ grn_id: grnId });
  } catch (error) {
    next(error);
  }
}