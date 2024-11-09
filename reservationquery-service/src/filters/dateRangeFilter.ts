import { Filter } from './filter';

export class DateRangeFilter implements Filter {
  process(reservations: any[], criteria: any): any[] {
    const { startDate, endDate } = criteria;
    if (!startDate || !endDate) return reservations;

    return reservations.filter(reservation =>
      new Date(reservation.get('startDate')) >= new Date(startDate) &&
      new Date(reservation.get('endDate')) <= new Date(endDate)
    );
  }
}
