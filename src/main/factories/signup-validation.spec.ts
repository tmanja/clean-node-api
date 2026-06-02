import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation"
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation"
import { Validation } from "../../presentation/helpers/validators/validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validations"

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite', () => {
    makeSignUpValidation()
    let validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      validations = [...validations, new RequiredFieldValidation(field)]
    }
    validations = [...validations, new CompareFieldsValidation('password', 'passwordConfirmation')]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})