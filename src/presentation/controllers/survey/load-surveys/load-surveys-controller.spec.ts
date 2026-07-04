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

describe('LoadSurveys Controller', () => {
  test('should call LoadsSurveys', async () => {
    class LoadSurveysStub implements LoadSurveys {
      async load(): Promise<SurveyModel[]> {
        return Promise.resolve(makeFakeSurveys())
      }
    }
    const loadSurveysStub = new LoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveysStub)
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})