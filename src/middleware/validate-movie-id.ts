import type { Request, Response, NextFunction } from 'express';

export function validateId(req: Request, res: Response, next: NextFunction) {
  const movieId = parseInt(req.params.id!);

  if (isNaN(movieId)) {
    return res.status(400).json({ error: 'Invalid movie ID provided' });
  }

  req.params.id = movieId.toString();

  next();
}
