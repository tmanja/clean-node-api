const AuthUseCase = require('./auth-usecase')

describe('AuthUseCase', () => {
  it('should throws if no email is provided', async () => {
    const sut = new AuthUseCase()
    const PromiseAccessToken = sut.auth()
    expect(PromiseAccessToken).rejects.toThrow()
  })
})
