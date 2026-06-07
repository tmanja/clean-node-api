import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository"
import { AccountModel } from "../../domain/models/account"
import { serverError, ok } from "../../presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log-controller-decorator"

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

function makeController (): Controller {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()))
    }
  }
  return new ControllerStub()
}

function makeLogErrorRepository (): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
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

function makeFakeServerError (): HttpResponse {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository 
}

function makeSut (): SutTypes {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut, 
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerHandleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same controller result', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('should call LogErrorRepository with error stack if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(makeFakeServerError())
    await sut.handle(makeFakeHttpRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})