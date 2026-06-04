import { Credentials } from "../../../domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'encrypted_password'
  }
}

function makeLoadAccountByEmailRepository (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    load(email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount()) 
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

function makeFakeCredentials (): Credentials {
  return {
    email: 'any_email@mail.com',
    password: 'any_password' 
  }
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(loadSpy).toHaveBeenCalledWith(credentials.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(fakeError)
    const accessTokenPromise = sut.auth(makeFakeCredentials())
    expect(accessTokenPromise).rejects.toThrow()
  })
})