import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'

function makeFakeSurveys(): SurveyModel[] {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      id: 'another_id',
      question: 'another_question',
      answers: [
        {
          image: 'another_image',
          answer: 'another_answer',
        },
      ],
      date: new Date(),
    },
  ]
}

function makeLoadSurveys(): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadAll(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

function makeSut(): SutTypes {
  const loadSurveysRepositoryStub = makeLoadSurveys()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub,
  }
}

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('should return a surveys list', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('should throw when LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const fakeError = new Error()
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockRejectedValueOnce(fakeError)
    const surveysPromise = sut.load()
    await expect(surveysPromise).rejects.toThrow(fakeError)
  })
})
