const HttpResponse = require('../helpers/http-response-helper')
const { MissingParamError, InvalidParamError } = require('../errors')

class LoginController {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async handle (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorized()
      }
      return HttpResponse.ok({ accessToken })
    } catch (error) {
      return HttpResponse.internalServerError()
    }
  }
}

module.exports = LoginController
