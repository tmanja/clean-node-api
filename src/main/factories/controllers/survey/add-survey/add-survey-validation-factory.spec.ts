import { makeAddSurveyValidation } from "./add-survey-validation-factory"
import { Validation } from "@/presentation/protocols/validation"
import { RequiredFieldValidation, ValidationComposite } from "@/validation/validators"

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    let validations: Validation[] = []
    const requiredFields = ['question', 'answers']
    for (const field of requiredFields) {
      validations = [...validations, new RequiredFieldValidation(field)]
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})