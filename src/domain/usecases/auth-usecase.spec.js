const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

describe('AuthUseCase', () => {
  it('should throws if no email is provided', async () => {
    const sut = new AuthUseCase()
    const PromiseAccessToken = sut.auth()
    await expect(PromiseAccessToken).rejects.toThrow(new MissingParamError('email'))
  })
  it('should throws if no password is provided', async () => {
    const sut = new AuthUseCase()
    const PromiseAccessToken = sut.auth('any_email@mail.com')
    await expect(PromiseAccessToken).rejects.toThrow(new MissingParamError('password'))
  })
})
