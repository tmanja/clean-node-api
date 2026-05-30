import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

function makeController (): Controller {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const fakeHttpResponse: HttpResponse = {
        statusCode: 200,
        body: {}
      }
      return Promise.resolve(fakeHttpResponse)
    }
  }
  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller
}

function makeSut (): SutTypes {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut, 
    controllerStub
  }
}

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerHandleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same controller result', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {}
    })
  })
})