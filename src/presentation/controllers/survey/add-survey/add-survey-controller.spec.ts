import { badRequest, noContent, serverError } from "@/presentation/helpers/http/http-helper"
import { AddSurveyController } from "./add-survey-controller"
import { AddSurvey, HttpRequest, Survey, Validation } from "./add-survey-controller-protocols"
import MockDate from 'mockdate'

function makeFakeHttpRequest (): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
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

function makeAddSurvey (): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(survey: Survey): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

type SutTypes = {
  sut: AddSurveyController,
  validationStub: Validation,
  addSurveyStub: AddSurvey
}

function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

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

  test('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const fakeHttpRequest = makeFakeHttpRequest()
    await sut.handle(fakeHttpRequest)
    const { question, answers } = fakeHttpRequest.body
    expect(addSpy).toHaveBeenCalledWith({
      question,
      answers,
      date: new Date()
    })
  })

  test('should return 500 when AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(fakeError)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(fakeError))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
