import { AuthMiddleware } from "./auth-middleware"
import { AccountModel, HttpRequest, LoadAccountByToken } from "./auth-middleware-protocols"
import { AccessDeniedErrror } from "@/presentation/errors"
import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper"

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

function makeFakeHttpRequest (): HttpRequest {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

function makeSut (role?: string): SutTypes {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut, 
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('should return 403 when no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedErrror()))
  })

  test('should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeHttpRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('should return 403 when LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedErrror()))
  })

  test('should return 200 when LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    const fakeAccount = makeFakeAccount()
    expect(httpResponse).toEqual(ok( { accountId: fakeAccount.id }))
  })

  test('should return 500 when LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(fakeError)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(fakeError))
  })
})