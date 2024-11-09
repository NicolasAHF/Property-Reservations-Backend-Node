import { Filter } from './filter';

export class EmailFilter implements Filter {
  process(reservations: any[], criteria: any): any[] {
    const { email } = criteria;
    if (!email) return reservations;

    return reservations.filter(reservation => reservation.get('email') === email);
  }
}
