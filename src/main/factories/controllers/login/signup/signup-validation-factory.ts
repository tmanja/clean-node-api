import { EmailValidatorAdapter } from "../../../../../infra/validators/email-validator-adapter";
import { Validation } from "../../../../../presentation/protocols/validation";
import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from "../../../../../validation/validators";

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
