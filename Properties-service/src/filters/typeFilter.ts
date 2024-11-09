import { Filter } from "./filter";

export class TypeFilter implements Filter {
    process(properties: any[], criteria: any): any[] {
      const { type } = criteria;
      if (!type) return properties;
  
      if (type !== 1 && type !== 2) throw Error("Tipo fuera de rango");
  
      return properties.filter(property => property.type === type);
    }
  }