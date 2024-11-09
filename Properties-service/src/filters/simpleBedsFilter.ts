import { Filter } from "./filter";

export class SimpleBedsFilter implements Filter {
    process(properties: any[], criteria: any): any[] {
      const { simpleBeds } = criteria;
      if (!simpleBeds) return properties;
  
      if (simpleBeds > 20 || simpleBeds < 0) throw Error("Camas simples fuera de rango");
  
      return properties.filter(property => property.simpleBeds === simpleBeds);
    }
  }