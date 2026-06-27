import { MissingParamError, InvalidParamError } from "../../presentation/errors"
import { Validation } from "../../presentation/protocols/validation"
import { ValidationComposite } from "./validation-composite"

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite,
  validationStubs: Validation[]
}

function makeSut (): SutTypes {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut, 
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const missingParamError = new MissingParamError('anyField')
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(missingParamError)
    const validationError = sut.validate({ anyField: 'any_value' })
    expect(validationError).toEqual(missingParamError)
  })

  test('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const missingParamError = new MissingParamError('anyField')
    const invalidParamError = new InvalidParamError('anyField')
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(missingParamError)
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(invalidParamError)
    const validationError = sut.validate({ anyField: 'any_value' })
    expect(validationError).toEqual(missingParamError)
  })

    test('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const validationError = sut.validate({ anyField: 'any_value' })
    expect(validationError).toBeFalsy()
  })
})