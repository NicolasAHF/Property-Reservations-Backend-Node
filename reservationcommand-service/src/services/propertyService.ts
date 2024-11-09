import axios from 'axios';
import logger from '../utils/logger'

export const checkPropertyAvailability = async (propertyId: string, startDate: Date, endDate: Date): Promise<boolean> => {
  try {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    logger.info('Checking property availability for propertyId: %s, startDate: %s, endDate: %s', propertyId, startDate, endDate);

    const response = await axios.get(`${process.env.RESERVATIONSQUERY_SERVICE_URL}/api/reservations/search`, {
      params: { propertyId }
    });

    const reservations = response.data;

    const overlappingReservations = reservations.filter((reservation: any) => {

      const existingStartDate = new Date(reservation.startDate);
      const existingEndDate = new Date(reservation.endDate);

      return (newStartDate < existingEndDate && newEndDate > existingStartDate);
    });


    const isAvailable = overlappingReservations.length === 0;

    logger.info('Availability check result: %s', isAvailable);

    return isAvailable;
  } catch (error: any) {
    logger.error('Could not check property availability', { error: error.message });
    throw new Error('Could not check property availability');
  }
};

export const checkOccupancyLimit = async (propertyId: string, totalOccupants: number): Promise<boolean> => {
  const response = await axios.get(`${process.env.PROPERTY_SERVICE_URL}/api/property/${propertyId}`);
  
  return totalOccupants <= (response.data.adultsQuantity + response.data.childrenQuantity);
};

export const validatePropertyAgenda = async (propertyId: string, startDate: Date, endDate: Date): Promise<boolean> => {
  try {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    logger.info('Validating property agenda for propertyId: %s, startDate: %s, endDate: %s', propertyId, startDate, endDate);

    const response = await axios.get(`${process.env.PROPERTY_SERVICE_URL}/api/unavailable/${propertyId}`);
    const unavailableDates: any = response.data.Unavailables;


    const overlappingUnavailable = unavailableDates.filter((unavailable: any) => {
      const unavailableStartDate = new Date(unavailable.from);
      const unavailableEndDate = new Date(unavailable.to);

      return (newStartDate < unavailableEndDate && newEndDate > unavailableStartDate);
    });

    const isAvailable = overlappingUnavailable.length === 0;

    logger.info('Property agenda validation result: %s', isAvailable);

    return isAvailable;
  } catch (error: any) {
    logger.error('Could not validate property agenda', { error: error.message });
    throw new Error('Could not validate property agenda');
  }
};
