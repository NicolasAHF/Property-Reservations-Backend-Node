import express, { Request, Response, NextFunction } from 'express';

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
};