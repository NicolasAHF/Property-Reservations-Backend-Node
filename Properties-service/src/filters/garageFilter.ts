import { Filter } from './filter';

export class GarageFilter implements Filter {
  process(properties: any[], criteria: any): any[] {
    const { garaje } = criteria;
    if (garaje === undefined) return properties;

    return properties.filter(property => property.garaje === garaje);
  }
}
