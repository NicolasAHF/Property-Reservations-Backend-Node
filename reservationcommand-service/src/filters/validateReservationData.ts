import axios from 'axios';
import logger from '../utils/logger';
import { Filter } from './filter';

export class ValidateReservationDataFilter implements Filter {
  async process(criteria: any): Promise<void> {
    const { document, name, surname, email, phoneNumber, address, nationality, country, propertyId, startDate, endDate, adults, children } = criteria;

    logger.info('Validating reservation data for propertyId: %s, startDate: %s, endDate: %s', propertyId, startDate, endDate);

    if (!document || !name || !surname || !email || !phoneNumber || !address || !nationality || !country || !propertyId || !startDate || !endDate || adults == null || children == null) {
      logger.warn('Missing required fields');
      throw new Error('Missing required fields');
    }

    try {
      logger.info('Fetching property data for propertyId: %s', propertyId);
      const response = await axios.get(`${process.env.PROPERTY_SERVICE_URL}/api/property/${propertyId}`);
      const property = response.data;

      if (!property) {
        logger.warn('Property not found for propertyId: %s', propertyId);
        throw new Error('Property not found');
      }

      logger.info('Property validated successfully for propertyId: %s', propertyId);
    } catch (error: any) {
      logger.error('Error fetching property for propertyId: %s, error: %s', propertyId, error.message);
      throw new Error('Error validating property');
    }
  }
}
