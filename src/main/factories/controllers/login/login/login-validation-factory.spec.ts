import { makeLoginValidation } from "./login-validation-factory"
import { RequiredFieldValidation, EmailValidation, ValidationComposite } from "@/validation/validators"
import { Validation } from "@/presentation/protocols/validation"
import { EmailValidator } from "@/validation/protocols/email-validator"

jest.mock('@/validation/validators/validation-composite')

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    let validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations = [...validations, new RequiredFieldValidation(field)]
    }
    validations = [
      ...validations,
      new EmailValidation('email', makeEmailValidator())
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})