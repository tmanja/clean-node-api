import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

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
