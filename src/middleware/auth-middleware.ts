import type { Request, Response, NextFunction } from 'express';

type Token = {
  issuedAt: Date;
};

const isValidAuthTimestamp = (token: Token): boolean => {
  const tokenTime = token.issuedAt.getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - tokenTime) / 1000; // Convert to seconds

  return timeDifference >= 0 && timeDifference <= 3600; // Token valid for 1 hour
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Unauthorized; No Authorisation Header', status: 401 });
  }

  const tokenStr = authHeader.replace('Bearer ', '');
  const token: Token = { issuedAt: new Date(tokenStr) };

  if (!isValidAuthTimestamp(token)) {
    return res
      .status(401)
      .json({ error: 'Unauthorized; Not valid timestamp', status: 401 });
  }
  next();
}
