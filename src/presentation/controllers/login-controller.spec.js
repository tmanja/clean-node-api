const MissingParamError = require('../errors/missing-param-error')
const HttpResponse = require('../helpers/http-response-helper')
const LoginController = require('./login-controller')

describe('Login Controller', () => {
  it('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle()
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })
  it('should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const fakehttpRequest = { body: { password: 'any_password' } }
    const httpResponse = await sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('email')))
  })
  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const fakehttpRequest = { body: { email: 'any_email@mail.com' } }
    const httpResponse = await sut.handle(fakehttpRequest)
    expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('password')))
  })

  it('should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginController()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })
  it('should return 500 if AuthUseCase has no auth method', async () => {
    const sut = new LoginController({})
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })
  it('should call AuthUseCase with correct values', async () => {
    const { sut, mockAuthUseCase } = makeSut()
    const { email, password } = makeFakeHttpRequest().body
    await sut.handle(makeFakeHttpRequest())
    expect(mockAuthUseCase.auth).toHaveBeenCalledWith(email, password)
  })
  it('should return 500 if AuthUseCase throws', async () => {
    const { sut, mockAuthUseCase } = makeSut()
    mockAuthUseCase.auth.mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(HttpResponse.internalServerError())
  })

  it('should return 401 when invalid credentials are provided', async () => {
    const { sut, mockAuthUseCase } = makeSut()
    mockAuthUseCase.auth.mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(HttpResponse.unauthorized())
  })
  it('should return 200 when valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(HttpResponse.ok({ accessToken: makeFakeAccessToken() }))
  })
})

function makeSut () {
  const mockAuthUseCase = { auth: jest.fn().mockResolvedValue(makeFakeAccessToken()) }
  const sut = new LoginController(mockAuthUseCase)
  return { sut, mockAuthUseCase }
}

function makeFakeAccessToken () {
  return 'any_token'
}

function makeFakeHttpRequest () {
  return { body: { email: 'any_email@mail.com', password: 'any_password' } }
}
