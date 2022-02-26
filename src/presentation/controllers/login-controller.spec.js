const MissingParamError = require('../errors/missing-param-error')
const HttpResponse = require('../helpers/http-response-helper')
const LoginController = require('./login-controller')

function makeSut () {
  const mockAuthUseCase = { auth: jest.fn(_ => 'valid_token') }
  const sut = new LoginController(mockAuthUseCase)
  return { sut, mockAuthUseCase }
}

describe('Login Controller', () => {
  it('should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut()
    const httpResponse = sut.handle()
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })
  it('should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut()
    const fakeHttpRequestWithoutBody = {}
    const httpResponse = sut.handle(fakeHttpRequestWithoutBody)
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })
  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const fakehttpRequest = { body: { password: 'any_password' } }
    const httpResponse = sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('email')))
  })
  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const fakehttpRequest = { body: { email: 'any_email@mail.com' } }
    const httpResponse = sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('password')))
  })
  it('should return 500 if no AuthUseCase is provided', () => {
    const sut = new LoginController()
    const fakehttpRequest = { body: { email: 'any_email@mail.com', password: 'any_password' } }
    const httpResponse = sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })
  it('should return 500 if AuthUseCase has no auth method', () => {
    const fakeAuthUseCaseWithoutAuthMethod = {}
    const sut = new LoginController(fakeAuthUseCaseWithoutAuthMethod)
    const fakehttpRequest = { body: { email: 'any_email@mail.com', password: 'any_password' } }
    const httpResponse = sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })
  it('should call AuthUseCase with email and password', () => {
    const { sut, mockAuthUseCase } = makeSut()
    const fakehttpRequest = { body: { email: 'any_email@mail.com', password: 'any_password' } }
    const { email, password } = fakehttpRequest.body
    sut.handle(fakehttpRequest)
    expect(mockAuthUseCase.auth).toHaveBeenCalledWith(email, password)
  })
  it('should return 401 when invalid credentials are provided', () => {
    const { sut, mockAuthUseCase } = makeSut()
    mockAuthUseCase.auth.mockReturnValueOnce(null)
    const fakehttpRequest = { body: { email: 'invalid_email@mail.com', password: 'invalid_password' } }
    const httpResponse = sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.unauthorized())
  })
  it('should return 200 when valid credentials are provided', () => {
    const { sut, mockAuthUseCase } = makeSut()
    const fakeAccessToken = mockAuthUseCase.auth()
    const fakehttpRequest = { body: { email: 'valid_email@mail.com', password: 'valid_password' } }
    const httpResponse = sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.ok({ accessToken: fakeAccessToken }))
  })
})
