import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyMongoRepository } from "./survey-mongo-repository";

function makeSut () {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  });

  test('should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'another_answer'
        }
      ]
    })
    const survey = await surveyCollection.findOne({ question: 'any_question'})
    expect(survey).toBeTruthy()
  })
})