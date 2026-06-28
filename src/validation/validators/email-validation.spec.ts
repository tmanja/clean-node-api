import { InvalidParamError } from "../../presentation/errors"
import { EmailValidator } from "../protocols/email-validator"
import { EmailValidation } from "./email-validation"

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator,
}

function makeSut (): SutTypes {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('should return an InvalidParamError when EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const validationError = sut.validate({ email: 'invalid_email@mail.com' })
    expect(validationError).toEqual(new InvalidParamError('email'))
  }) 

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw when EmailValidator throws', () => {
    const { sut, emailValidatorStub  } = makeSut()
    const fakeError = new Error()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw fakeError
    })
    expect(sut.validate).toThrow()
  })
})