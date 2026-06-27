import { badRequest } from "../../helpers/http/http-helper"
import { AddSurveyController } from "./add-survey-controller"
import { HttpRequest, Validation } from "./add-survey-controller-protocols"

function makeFakeHttpRequest (): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  } 
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
  sut: AddSurveyController,
  validationStub: Validation
}

function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const fakeHttpRequest = makeFakeHttpRequest()
    await sut.handle(fakeHttpRequest)
    expect(validateSpy).toHaveBeenCalledWith(fakeHttpRequest.body)
  })

  test('should return 400 when validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(fakeError)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(fakeError))
  })
})
