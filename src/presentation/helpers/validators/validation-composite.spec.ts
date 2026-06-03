import { MissingParamError } from "../../errors"
import { Validation } from "./validation"
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
  validationStub: Validation
}

function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return {
    sut, 
    validationStub
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    const missingParamError = new MissingParamError('anyField')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(missingParamError)
    const validationError = sut.validate({ anyField: 'any_value' })
    expect(validationError).toEqual(missingParamError)
  })
})