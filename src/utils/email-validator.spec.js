const EmailValidator = require('./email-validator')
const validator = require('validator')

describe('Email Validator', () => {
  it('should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })
  it('should return false if validator returns false', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalid_email@mail.com')
    expect(isEmailValid).toBe(false)
  })
  it('should call validator with correct email', () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@mail.com')
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})

function makeSut () {
  return new EmailValidator()
}
