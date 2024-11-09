import { Filter } from './filter';

export class ACFilter implements Filter {
  process(properties: any[], criteria: any): any[] {
    const { ac } = criteria;
    if (ac === undefined) return properties;

    return properties.filter(property => property.ac === ac);
  }
}
