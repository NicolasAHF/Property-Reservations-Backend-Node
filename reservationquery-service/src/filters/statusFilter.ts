import { Filter } from './filter';

export class StatusFilter implements Filter {
  process(reservations: any[], criteria: any): any[] {
    if (!criteria.status) {
      return reservations;
    }
    return reservations.filter(reservation => reservation.get('status') === criteria.status);
  }
}
