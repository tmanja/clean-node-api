const HttpResponse = require('../helpers/http-response-helper')
const MissingParamError = require('../errors/missing-param-error')

class LoginController {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  handle (httpRequest) {
    if (!httpRequest?.body || !this.authUseCase?.auth) {
      return HttpResponse.internalServerError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'))
    }
    if (!password) {
      return HttpResponse.badRequest(new MissingParamError('password'))
    }
    const accessToken = this.authUseCase.auth(email, password)
    if (!accessToken) {
      return HttpResponse.unauthorized()
    }
    return HttpResponse.ok({ accessToken })
  }
}

module.exports = LoginController
