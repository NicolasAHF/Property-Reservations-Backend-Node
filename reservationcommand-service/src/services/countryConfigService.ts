import { Request, Response } from 'express';
import CountryConfig from '../models/CountryConfig';
import logger from '../utils/logger';

export const createCountryConfig = async (req: Request, res: Response) => {
  const { country, daysNotice, refundPercentage } = req.body;

  logger.info('Creating country configuration for country: %s', country);

  try {
    const config = await CountryConfig.create({
      country,
      daysNotice,
      refundPercentage
    });

    logger.info('Country configuration created successfully for country: %s', country);
    res.status(200).json(config);
  } catch (error: any) {
    logger.error('Error creating country configuration for country: %s, error: %s', country, error.message);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateCountryConfig = async (req: Request, res: Response) => {
  const { country, daysNotice, refundPercentage } = req.body;

  logger.info('Updating country configuration for country: %s', country);

  try {
    const config = await CountryConfig.findOne({ where: { country } });

    if (!config) {
      logger.warn('Country configuration not found for country: %s', country);
      return res.status(404).json({ message: 'Country configuration not found' });
    }

    config.set('daysNotice', daysNotice);
    config.set('refundPercentage', refundPercentage);
    await config.save();

    logger.info('Country configuration updated successfully for country: %s', country);
    res.status(200).json({ message: 'Country configuration updated successfully' });
  } catch (error: any) {
    logger.error('Error updating country configuration for country: %s, error: %s', country, error.message);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
