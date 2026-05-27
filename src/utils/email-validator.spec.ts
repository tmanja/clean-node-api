import { EmailValidatorAdapter } from "./email-validator"

describe('EmailValidator Adapter', () => { 
  test('should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const emailIsValid = sut.isValid('invalid_email@mail.com')
    expect(emailIsValid).toBe(false)
  })
})