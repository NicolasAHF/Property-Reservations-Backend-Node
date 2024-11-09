import { Filter } from "./filter";

export class BeachDistanceFilter implements Filter {
    process(properties: any[], criteria: any): any[] {
      const { beachDistance } = criteria;
      if (!beachDistance) return properties;
  
      if (beachDistance > 20000 || beachDistance < 50) throw Error("Metros de la playa fuera de rango");
  
      return properties.filter(property => property.beachDistance === beachDistance);
    }
}