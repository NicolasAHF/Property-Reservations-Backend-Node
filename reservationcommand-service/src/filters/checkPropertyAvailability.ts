import logger from '../utils/logger';
import { checkPropertyAvailability } from '../services/propertyService';
import { Filter } from './filter';

export class CheckPropertyAvailabilityFilter implements Filter {
  async process(criteria: any): Promise<void> {
    const { propertyId, startDate, endDate } = criteria;
    if (!propertyId || !startDate || !endDate) return;

    try {
      console.log('checkPropertyAvailability');
      const isAvailable = await checkPropertyAvailability(propertyId, new Date(startDate), new Date(endDate));
      if (!isAvailable) {
        logger.warn('Property not available for the selected dates: propertyId: %s, startDate: %s, endDate: %s', propertyId, startDate, endDate);
        throw new Error('Property not available for the selected dates');
      }
    } catch (error: any) {
      logger.error('Error in checkPropertyAvailabilityFilter', { error: error.message });
      throw error;
    }
  }
}
