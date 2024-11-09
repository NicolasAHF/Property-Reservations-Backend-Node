import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { Filter } from './filter';

dotenv.config();

export class FindOrCreateTenantFilter implements Filter {
  async process(criteria: any): Promise<void> {
    const { document } = criteria;

    logger.info('Looking for tenant with document: %s', document);

    try {
      const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, {
        params: { document: document }
      });

      if (response.data) {
        logger.info('Tenant found: %s', response.data.email);
      } else {
        logger.warn('Tenant not found with document: %s', document);
        throw new Error('Tenant not found');
      }
    } catch (error: any) {
      logger.error('Error fetching tenant with document: %s, error: %s', document, error.message);
      throw error;
    }
  }
}
