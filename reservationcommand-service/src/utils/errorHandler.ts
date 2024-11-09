import { Request, Response, NextFunction } from 'express';

const errorHandler = (error: Error, req: Request, res: Response, next?: NextFunction) => {
  console.error('Error details:', error);

  if (res.headersSent) {
    if (next) {
      return next(error);
    }
  }

  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

export default errorHandler;
