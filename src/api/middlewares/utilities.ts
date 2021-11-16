import { Request, Response } from 'express';

export function idChecker(text: string) {
    return function(req: Request, res: Response, next: () => void) {
      const id: number = parseInt(req.params.id);
      !id ? res.status(400).json({ error: `INVALID_${text}_ID` }) : next();
    };
  }
  