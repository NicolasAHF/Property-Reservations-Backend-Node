import { Filter } from "../filters/filter";

export class Pipe {
  filters: Filter[];

  constructor(filters: Filter[] = []) {
    this.filters = filters;
  }

  async process(criteria: any): Promise<any> {
    let result

    for (const filter of this.filters) {
      result = await filter.process(criteria);
    }

    return result;
  }
}
