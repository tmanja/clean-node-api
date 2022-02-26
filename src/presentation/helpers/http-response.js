const ServerError = require('../errors/server-error')

class HttpResponse {
  static badRequest (error) {
    return { statusCode: 400, error }
  }

  static serverError () {
    return { statusCode: 500, error: new ServerError() }
  }
}

module.exports = HttpResponse
