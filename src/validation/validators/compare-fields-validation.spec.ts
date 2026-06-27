import { InvalidParamError } from "../../presentation/errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

function makeSut (): CompareFieldsValidation {
  return new CompareFieldsValidation('anyField', 'anyFieldToCompare')
}

describe('CompareFields Validation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const validationError = sut.validate({
      anyField: 'any_value',
      anyFieldToCompare: 'another_value'
    })
    expect(validationError).toEqual(new InvalidParamError('anyFieldToCompare'))
  })

  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const validationError = sut.validate({
      anyField: 'any_value',
      anyFieldToCompare: 'any_value'
    })
    expect(validationError).toBeFalsy()
  })
})