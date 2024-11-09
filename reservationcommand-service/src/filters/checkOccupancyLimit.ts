import { checkOccupancyLimit } from '../services/propertyService';
import logger from '../utils/logger';
import { Filter } from './filter';

export class CheckOccupancyLimitFilter implements Filter {
  async process(criteria: any): Promise<void> {
    const { propertyId, adults, children } = criteria;
    const totalOccupants = adults + children;

    logger.info('Checking occupancy limit for propertyId: %s, totalOccupants: %d', propertyId, totalOccupants);

    try {
      const withinOccupancyLimit = await checkOccupancyLimit(propertyId, totalOccupants);
      if (!withinOccupancyLimit) {
        logger.warn('Number of occupants exceeds the property limit for propertyId: %s', propertyId);
        throw new Error('Number of occupants exceeds the property limit');
      }
      logger.info('Occupancy limit check passed for propertyId: %s', propertyId);
    } catch (error: any) {
      logger.error('Error checking occupancy limit for propertyId: %s, error: %s', propertyId, error.message);
      throw error;
    }
  }
}
