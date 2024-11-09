import { Filter } from './filter';

export class PropertyCodeFilter implements Filter {
  process(reservations: any[], criteria: any): any[] {
    const { propertyCode } = criteria;
    if (!propertyCode) return reservations;

    return reservations.filter(reservation => reservation.get('propertyId') === propertyCode);
  }
}
