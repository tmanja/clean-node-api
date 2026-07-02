import { AccountModel } from "../../domain/models/account"
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token"
import { AccessDeniedErrror } from "../errors"
import { forbidden } from "../helpers/http/http-helper"
import { AuthMiddleware } from "./auth-middleware"

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

describe('Auth Middleware', () => {
  test('should return 403 when no x-access-token exists in headers', async () => {
        class LoadAccountByTokenStub implements LoadAccountByToken {
      async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
        return Promise.resolve(makeFakeAccount())
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedErrror()))
  })

  test('should call LoadAccountByToken with correct access token', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
        return Promise.resolve(makeFakeAccount())
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })
})