const MissingParamError = require('../errors/missing-param-error')
const { badRequest, serverError } = require('../helpers/http-response')
const LoginController = require('./login-controller')

function makeSut () {
  return new LoginController()
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', () => {
    const sut = makeSut()
    const httpRequest = { body: { password: 'any_password' } }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  it('should return 400 if no password is provided', () => {
    const sut = makeSut()
    const httpRequest = { body: { email: 'any_email@mail.com' } }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  it('should return 500 if no httpRequest is provided', () => {
    const sut = makeSut()
    const httpResponse = sut.handle()
    expect(httpResponse).toEqual(serverError())
  })
  it('should return 500 if httpRequest has no body', () => {
    const sut = makeSut()
    const httpRequest = {}
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })
})
