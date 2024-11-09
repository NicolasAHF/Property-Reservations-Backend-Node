import { Filter } from "./filter";

export class ChildrenQuantityFilter implements Filter {
    process(properties: any[], criteria: any): any[] {
      const { childrenQuantity } = criteria;
      if (!childrenQuantity) return properties;
  
      if (childrenQuantity > 20 || childrenQuantity < 0) throw Error("Niños fuera de rango");
  
      return properties.filter(property => property.childrenQuantity === childrenQuantity);
    }
}