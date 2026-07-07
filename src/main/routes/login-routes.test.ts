import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import bcrypt from 'bcrypt'

describe('Login Routes ', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  });
  
  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
      await request(app)
      .post('/api/signup')
      .send({
        name: 'Thalles',
        email: 'thalles.manjaterra@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
    })
  })
  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const salt = 12
      const hashedPassword = await bcrypt.hash('123', salt)
      await accountCollection.insertOne({
        name: 'Thalles',
        email: 'thalles.manjaterra@gmail.com',
        password: hashedPassword,
      })
      await request(app)
      .post('/api/login')
      .send({
        email: 'thalles.manjaterra@gmail.com',
        password: '123',
      })
      .expect(200)
    })

    test('should return 401 on login', async () => {
      await request(app)
      .post('/api/login')
      .send({
        email: 'thalles.manjaterra@gmail.com',
        password: '123',
      })
      .expect(401)
    })
  })
})