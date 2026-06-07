import { MissingParamError } from "../../errors"
import {  badRequest, ok, serverError, unauthorized } from "../../helpers/http/http-helper"
import { LoginController } from "./login-controller"
import { Authentication, Credentials, HttpRequest, Validation } from "./login-controller-protocols"

function makeAuthentication (): Authentication {
  class AuthenticationStub implements Authentication {
    async auth (credentials: Credentials): Promise<string | null> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController,
  validationStub: Validation
  authenticationStub: Authentication,
}

function makeSut (): SutTypes {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
    authenticationStub
  }
}

function makeFakeHttpRequest (): HttpRequest {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  } 
}

describe('Login Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const isValidSpy = jest.spyOn(authenticationStub, 'auth')
    const fakeHttpRequest = makeFakeHttpRequest()
    await sut.handle(fakeHttpRequest)
    const { email, password } = fakeHttpRequest.body
    expect(isValidSpy).toHaveBeenCalledWith({
      email,
      password
    })
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(fakeError)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(fakeError))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const missingParamError = new MissingParamError('any_field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(missingParamError)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(missingParamError))
  })
})