import { Filter } from './filter';

export class StateFilter implements Filter {
  process(properties: any[], criteria: any): any[] {
    const { state } = criteria;
    if (!state) return properties;

    return properties.filter(property => property.state === state);
  }
}
