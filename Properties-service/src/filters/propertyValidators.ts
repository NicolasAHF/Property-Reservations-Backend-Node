import { Validator } from "../utils/validator";

export class NameValidator implements Validator {
    validate(property: any): void {
      if (!property.name) throw Error("Ingrese un nombre");
    }
}
  
export class AdultsQuantityValidator implements Validator {
    validate(property: any): void {
      if (!property.adultsQuantity || property.adultsQuantity > 20 || property.adultsQuantity < 1) throw Error("Adultos fuera de rango");
    }
}
  
export class ChildrenQuantityValidator implements Validator {
    validate(property: any): void {
      if (property.childrenQuantity === null || property.childrenQuantity > 20 || property.childrenQuantity < 0) throw Error("Niños fuera de rango");
    }
}
  
export class DoubleBedsValidator implements Validator {
    validate(property: any): void {
      if (!property.doubleBeds || property.doubleBeds > 10 || property.doubleBeds < 0) throw Error("Camas matrimoniales fuera de rango");
    }
}
  
export class SimpleBedsValidator implements Validator {
    validate(property: any): void {
      if (property.simpleBeds === null || property.simpleBeds > 20 || property.simpleBeds < 0) throw Error("Camas simples fuera de rango");
    }
}
  
export class TypeValidator implements Validator {
    validate(property: any): void {
      if (!property.type || (property.type != 1 && property.type != 2)) throw Error("Tipo fuera de rango 1 casa, 2 apartamento");
    }
}
  
export class BeachDistanceValidator implements Validator {
    validate(property: any): void {
      if (!property.beachDistance || property.beachDistance > 20000 || property.beachDistance < 50) throw Error("Metros de la playa fuera de rango");
    }
}
  
export class ACValidator implements Validator {
    validate(property: any): void {
      if (property.ac === null || property.ac === undefined) throw Error("Especifique si hay ac");
    }
}
  
export class GarajeValidator implements Validator {
  validate(property: any): void {
    if (property.garaje === null || property.garaje === undefined) {
      throw new Error("Especifique si hay garaje");
    }
  }
}
  
export class StateValidator implements Validator {
    validate(property: any): void {
      if (!property.state) throw Error("Especifique estado");
    }
}
  
export class BalnearioValidator implements Validator {
    validate(property: any): void {
      if (!property.balneario) throw Error("Especifique balneario");
    }
}
  
export class NeighborhoodValidator implements Validator {
    validate(property: any): void {
      if (!property.neighborhood) throw Error("Especifique barrio");
    }
}

export class ImagesValidator implements Validator {
    validate(property: any): void {
      if (!property.images || property.images.length < 4) {
        throw Error("Debe incluir al menos 4 imágenes");
      }
    }
}
  