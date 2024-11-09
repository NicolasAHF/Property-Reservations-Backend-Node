import CountryConfig from "../models/CountryConfig";
import { Request, Response } from 'express';

export const getCountryConfig = async (req: Request, res: Response) => {
    try {
      const configs = await CountryConfig.findAll();
      res.status(200).json(configs);
    } catch (error) {
      if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
  };