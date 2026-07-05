import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

describe('Survey Routes ', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  });
  
  describe('POST /surveys', () => {
    test('should return 403 on add survey without token', async () => {
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
      .expect(403)
    })

    test('should return 204 on add survey with valid token', async () => {
      const { insertedId } = await accountCollection.insertOne({
        name: 'Thalles',
        email: 'thalles.manjaterra@gmail.com',
        password: '123',
        role: 'admin'
      })
      const accessToken = sign({ id: insertedId }, env.jwtSecret)
      await accountCollection.updateOne({ 
        _id: insertedId
      }, {
        $set: { 
          accessToken
        }
      })
      await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
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

  describe('GET /surveys', () => {
    test('should return 403 on load surveys without token', async () => {
      await request(app)
      .get('/api/surveys')
      .send()
      .expect(403)
    })
  })
})