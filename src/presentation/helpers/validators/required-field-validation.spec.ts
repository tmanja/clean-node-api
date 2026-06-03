import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

describe('RequiedField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    const validationError = sut.validate({ another_field: 'any_value' })
    expect(validationError).toEqual(new MissingParamError('any_field'))
  })
})