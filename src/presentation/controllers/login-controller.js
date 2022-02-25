class LoginController {
  handle (httpRequest) {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400
      }
    }
  }
}

module.exports = LoginController
