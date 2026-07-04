import { noContent, ok, serverError } from "../../../helpers/http/http-helper"
import { LoadSurveysController } from "./load-surveys-controller"
import { LoadSurveys, SurveyModel } from "./load-surveys-controller-protocols"

function makeFakeSurveys (): SurveyModel[] {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'another_id',
    question: 'another_question',
    answers: [{
      image: 'another_image',
      answer: 'another_answer'
    }],
    date: new Date()
  }]
}

function makeLoadSurveys (): LoadSurveys {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController,
  loadSurveysStub: LoadSurveys
}

function makeSut (): SutTypes {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  test('should call LoadsSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys())) 
  })

  test('should return 204 when LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('should return 500 when LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(fakeError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(fakeError))
  })
})