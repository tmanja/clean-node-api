import { makeSignUpValidation } from "./signup-validations-factory"
import { EmailValidator } from "../../../../validation/protocols/email-validator"
import { Validation } from "../../../../presentation/protocols/validation"
import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from "../../../../validation/validators"

jest.mock('../../../../validation/validators/validation-composite')

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
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
      new EmailValidation('email', makeEmailValidator())
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})