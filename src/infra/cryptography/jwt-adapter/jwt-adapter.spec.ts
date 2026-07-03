import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () =>({
  sign (): string {
    return 'any_token'
  }
}))

function makeSut (): JwtAdapter {
  return new JwtAdapter('secret_key')
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id'}, 'secret_key')
    })
    
    test('should return an access token on sign success', () => {
      const sut = makeSut()
      const accessToken = sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('should throw when sign throws', () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      expect(() => sut.encrypt('any_id')).toThrow()
    })
  })
})