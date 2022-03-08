const AuthUseCase = require('./auth-usecase')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

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
  it('should throw if LoadUserByEmailRepository is not provided', async () => {
    const sut = new AuthUseCase()
    const accessTokenPromise = sut.auth('any_email@mail.com', 'any_password')
    await expect(accessTokenPromise).rejects.toThrow(new MissingParamError('LoadUserByEmailRepository'))
  })
  it('should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const accessTokenPromise = sut.auth('any_email@mail.com', 'any_password')
    await expect(accessTokenPromise).rejects.toThrow(new InvalidParamError('LoadUserByEmailRepository'))
  })
  it('should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('any_email@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
})

function makeSut () {
  const mockLoadUserByEmailRepository = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(mockLoadUserByEmailRepository)
  return { sut, mockLoadUserByEmailRepository }
}

function makeLoadUserByEmailRepository () {
  return { load: jest.fn() }
}
