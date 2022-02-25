const LoginController = require('./login-controller')

describe('Login Controller', () => {
  it('should return 400 if no email is provided', () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
  it('should return 400 if no password is provided', () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
  it('should return 500 if no httpRequest is provided', () => {
    const sut = new LoginController()
    const httpResponse = sut.handle()
    expect(httpResponse.statusCode).toBe(500)
  })
  it('should return 500 if httpRequest has no body', () => {
    const sut = new LoginController()
    const httpRequest = {}
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
