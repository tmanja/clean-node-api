const MissingParamError = require('../errors/missing-param-error')
const { badRequest, internalServerError, unauthorized } = require('../helpers/http-response')
const LoginController = require('./login-controller')

function makeSut () {
  const spyAuthUseCase = { auth: jest.fn() }
  const sut = new LoginController(spyAuthUseCase)
  return { sut, spyAuthUseCase }
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = { body: { password: 'any_password' } }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'any_email@mail.com' } }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  it('should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut()
    const httpResponse = sut.handle()
    expect(httpResponse).toEqual(internalServerError())
  })
  it('should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError())
  })
  it('should call AuthUseCase with email and password', () => {
    const { sut, spyAuthUseCase } = makeSut()
    const httpRequest = { body: { email: 'any_email@mail.com', password: 'any_password' } }
    const { email, password } = httpRequest.body
    sut.handle(httpRequest)
    expect(spyAuthUseCase.auth).toHaveBeenCalledWith(email, password)
  })
  it('should return 401 when invalid credentials are provided', () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'invalid_email@mail.com', password: 'invalid_password' } }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })
})
