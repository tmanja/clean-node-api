import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";

export function makeSignUpValidation (): ValidationComposite {
  let validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations = [...validations, new RequiredFieldValidation(field)]
  }
  return new ValidationComposite(validations)
}
