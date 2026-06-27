import { InvalidParamError } from "../../presentation/errors"
import { Validation } from "../../presentation/protocols/validation"
import { EmailValidator } from "../protocols/email-validator"

export class EmailValidation implements Validation {
  constructor (
    private fieldName: string, 
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error | undefined {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}