import { Filter } from './filter';

export class WifiFilter implements Filter {
  process(properties: any[], criteria: any): any[] {
    const { wifi } = criteria;
    if (wifi === undefined) return properties;

    return properties.filter(property => property.wifi === wifi);
  }
}
