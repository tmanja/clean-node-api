import { Validation } from "../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";
import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from "../../../presentation/helpers/validators";

export function makeSignUpValidation (): ValidationComposite {
  let validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations = [...validations, new RequiredFieldValidation(field)]
  }
  validations = [
    ...validations, 
    new CompareFieldsValidation('password', 'passwordConfirmation')
  ]
  validations = [
      ...validations,
      new EmailValidation('email', new EmailValidatorAdapter())
    ]
  return new ValidationComposite(validations)
}
