import { DbAddSurvey } from "./db-add-survey"
import { AddSurveyRepository, Survey } from "./db-add-survey-protocols"


function makeFakeSurvey (): Survey {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
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

interface SutTypes {
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
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const fakeSurvey = makeFakeSurvey()
    await sut.add(fakeSurvey)
    expect(addSpy).toHaveBeenCalledWith(fakeSurvey)
  })
})