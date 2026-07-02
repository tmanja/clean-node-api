import { AccountModel } from "../../domain/models/account"
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token"
import { AccessDeniedErrror } from "../errors"
import { forbidden, ok } from "../helpers/http/http-helper"
import { HttpRequest } from "../protocols"
import { AuthMiddleware } from "./auth-middleware"

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

function makeSut (): SutTypes {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
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

  test('should call LoadAccountByToken with correct access token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle(makeFakeHttpRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return 403 when LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedErrror()))
  })

  test('should return 200 when LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    const fakeAccount = makeFakeAccount()
    expect(httpResponse).toEqual(ok( { accountId: fakeAccount.id }))
  })
})