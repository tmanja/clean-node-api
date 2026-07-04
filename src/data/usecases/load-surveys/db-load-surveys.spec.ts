import { SurveyModel } from "../../../domain/models/survey"
import { LoadSurveysRepository } from "../../protocols/db/survey/load-surveys-repository"
import { DbLoadSurveys } from "./db-load-surveys"

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

describe('DbLoadSurveys Usecase', () => {
  test('should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      loadAll(): Promise<SurveyModel[]> {
        return Promise.resolve(makeFakeSurveys())
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})