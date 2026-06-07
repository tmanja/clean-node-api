import { Validation } from "../../protocols/validation";

export class ValidationComposite implements Validation {
  constructor (
    private readonly validations: Validation[]
  ) {}

  validate(input: any): Error | undefined {
    for (const validation of this.validations) {
      const validationError = validation.validate(input)
      if (validationError) {
        return validationError
      }
    }
  }
}