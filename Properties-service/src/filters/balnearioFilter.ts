import { Filter } from './filter';

export class BalnearioFilter implements Filter {
  process(properties: any[], criteria: any): any[] {
    const { balneario } = criteria;
    if (!balneario) return properties;

    return properties.filter(property => property.balneario === balneario);
  }
}
