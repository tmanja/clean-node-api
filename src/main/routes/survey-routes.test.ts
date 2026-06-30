import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

describe('Survey Routes ', () => {
  let surveyCollection: Collection

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
  
  describe('POST /surveys', () => {
    test('should return 204 on add survey success', async () => {
      await request(app)
      .post('/api/surveys')
      .send({
        question: 'Question',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }]
      })
      .expect(204)
    })
  })
})