import { Validator } from "../utils/validator";

export class ValidatorPipe {
    validators: Validator[];
  
    constructor(validators: Validator[] = []) {
      this.validators = validators;
    }
  
    validate(property: any): void {
      for (const validator of this.validators) {
        validator.validate(property);
      }
    }
}
  