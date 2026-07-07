import { EmailValidatorAdapter } from "@/infra/validators/email-validator-adapter"
import { Validation } from "@/presentation/protocols/validation"
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from "@/validation/validators"


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
