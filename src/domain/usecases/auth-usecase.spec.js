const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

describe('AuthUseCase', () => {
  it('should throws if no email is provided', async () => {
    const { sut } = makeSut()
    await expect(sut.auth).rejects.toThrow(new MissingParamError('email'))
  })
  it('should throws if no password is provided', async () => {
    const { sut } = makeSut()
    await expect(sut.auth('any_email@mail.com')).rejects.toThrow(new MissingParamError('password'))
  })
  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, mockLoadUserByEmailRepository } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(mockLoadUserByEmailRepository.load).toHaveBeenCalledWith('any_email@mail.com')
  })
})

function makeSut () {
  const mockLoadUserByEmailRepository = { load: jest.fn() }
  const sut = new AuthUseCase(mockLoadUserByEmailRepository)
  return { sut, mockLoadUserByEmailRepository }
}
