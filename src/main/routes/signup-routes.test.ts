import request from 'supertest'
import app from '../config/app'

describe('Signup Routes ', () => {
  test('should return an account on success', async () => {
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