import { Request, Response, NextFunction } from 'express';
import { grnSchema } from '../validators/grn.schema';
import * as grnService from '../services/grn.service';

export async function getGRNs(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Fetching GRNs...');
    const grns = await grnService.getGRNs();
    console.log('Successfully fetched GRNs:', grns.length);
    res.json(grns);
  } catch (error) {
    console.error('Error in getGRNs:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        error: 'Failed to fetch GRNs',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while fetching GRNs' });
    }
  }
}

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