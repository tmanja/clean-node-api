import { DbAddSurvey } from "./db-add-survey"
import { AddSurveyRepository, Survey } from "./db-add-survey-protocols"
import MockDate from 'mockdate'

function makeFakeSurvey (): Survey {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  } 
}

function makeAddSurveyRepository (): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(survey: Survey): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbAddSurvey,
  addSurveyRepositoryStub: AddSurveyRepository
}

function makeSut (): SutTypes {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
} 

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const fakeSurvey = makeFakeSurvey()
    await sut.add(fakeSurvey)
    expect(addSpy).toHaveBeenCalledWith(fakeSurvey)
  })

  test('should throws when AddSurveyRepository throws ', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const addSurveyPromise = sut.add(makeFakeSurvey())
    await expect(addSurveyPromise).rejects.toThrow()
  })
})