import { Validation } from "../../../../../presentation/protocols/validation"
import { ValidationComposite, RequiredFieldValidation } from "../../../../../validation/validators"

export function makeAddSurveyValidation (): ValidationComposite {
  let validations: Validation[] = []
  const requiredFields = ['question', 'answers']
  for (const field of requiredFields) {
    validations = [...validations, new RequiredFieldValidation(field)]
  }
  return new ValidationComposite(validations)
}
