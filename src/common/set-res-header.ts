import { Request, Response } from 'express';

export function sendResponse(req: Request, res: Response, newId: string): void {
  res.set(
    'Location',
    `${req.protocol}://${req.get('Host')}${req.originalUrl}/${newId}`,
  );
  res.set('ID', newId);
  res.send();
}
