import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('Jwt Adapter', () => {
  test('should call sign with correct values', () => {
    const sut = new JwtAdapter('secret_key')
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id'}, 'secret_key')
  })
})