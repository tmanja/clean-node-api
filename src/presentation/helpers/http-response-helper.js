const InternalServerError = require('../errors/internal-server-error')
const UnauthorizedError = require('../errors/unauthorized-error')

class HttpResponse {
  static badRequest (error) {
    return { statusCode: 400, error }
  }

  static internalServerError () {
    return { statusCode: 500, error: new InternalServerError() }
  }

  static unauthorized () {
    return { statusCode: 401, error: new UnauthorizedError() }
  }

  static ok (data) {
    return { statusCode: 200, data }
  }
}

module.exports = HttpResponse
