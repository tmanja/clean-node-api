import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () =>({
  sign (): string {
    return 'any_token'
  }
}))

describe('Jwt Adapter', () => {
  test('should call sign with correct values', () => {
    const sut = new JwtAdapter('secret_key')
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id'}, 'secret_key')
  })
  
  test('should return an access token on sign success', () => {
    const sut = new JwtAdapter('secret_key')
    const accessToken = sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  test('should throw if sign throws', () => {
    const sut = new JwtAdapter('secret_key')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(() => sut.encrypt('any_id')).toThrow()
  })
})