import { Filter } from "../filters/filter";

export class Pipe {
  filters: Filter[];

  constructor(filters: Filter[] = []) {
    this.filters = filters;
  }

  process(reservations: any[], criteria: any): any[] {
    let result = reservations;

    for (const filter of this.filters) {
      result = filter.process(result, criteria);
    }

    return result;
  }
}