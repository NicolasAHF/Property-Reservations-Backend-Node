import { Filter } from "./filter";

export class DoubleBedsFilter implements Filter {
    process(properties: any[], criteria: any): any[] {
      const { doubleBeds } = criteria;
      if (!doubleBeds) return properties;
  
      if (doubleBeds > 10 || doubleBeds < 0) throw Error("Camas matrimoniales fuera de rango");
  
      return properties.filter(property => property.doubleBeds === doubleBeds);
    }
}