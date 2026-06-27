import { EmailAlreadyInUseError, MissingParamError } from "../../errors"
import { badRequest, forbidden, ok, serverError } from "../../helpers/http/http-helper"
import { SignUpController } from "./signup-controller"
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation, Authentication, Credentials } from "./signup-controller-protocols"

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

function makeAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountStub()
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

function makeAuthentication (): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(credentials: Credentials): Promise<string | null> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: SignUpController,
  addAccountStub: AddAccount,
  validationStub: Validation,
  authenticationStub: Authentication
}

function makeSut (): SutTypes {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

function makeFakeHttpRequest (): HttpRequest {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}

describe('SignUp Controller', () => {
  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    const { name, email, password } = httpRequest.body
    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub  } = makeSut()
    const fakeError = new Error()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(fakeError)
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(fakeError))
  })

  test('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return Promise.resolve(null)
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new EmailAlreadyInUseError()))
  }) 

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token'}))
  }) 
  
  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const fakeMissingParamError = new MissingParamError('any_field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(fakeMissingParamError)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(fakeMissingParamError))
  }) 

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const fakeHttpRequest = makeFakeHttpRequest()
    await sut.handle(fakeHttpRequest)
    const { email, password } = fakeHttpRequest.body
    expect(authSpy).toHaveBeenCalledWith({
      email, 
      password
    })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(fakeError)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(fakeError))
  })
})