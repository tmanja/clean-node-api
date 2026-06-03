import { MissingParamError } from "../../errors"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate(input: any): Error | undefined {
        return new MissingParamError('anyField')
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const validationError = sut.validate({ anyField: 'any_value' })
    expect(validationError).toEqual(new MissingParamError('anyField'))
  })
})