import { Filter } from "./filter";

export class AdultsQuantityFilter implements Filter {
    process(properties: any[], criteria: any): any[] {
      const { adultsQuantity } = criteria;
      if (!adultsQuantity) return properties;
  
      if (adultsQuantity > 20 || adultsQuantity < 1) throw Error("Adultos fuera de rango");
  
      return properties.filter(property => property.adultsQuantity === adultsQuantity);
    }
  }