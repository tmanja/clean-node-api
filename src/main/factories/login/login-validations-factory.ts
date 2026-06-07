import { Validation } from "../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../adapters/validators/email-validator-adapter";
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../presentation/helpers/validators";

export function makeLoginValidation (): ValidationComposite {
  let validations: Validation[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations = [...validations, new RequiredFieldValidation(field)]
  }
  validations = [
      ...validations,
      new EmailValidation('email', new EmailValidatorAdapter())
    ]
  return new ValidationComposite(validations)
}
