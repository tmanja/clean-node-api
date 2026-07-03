import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
import { verify } from 'node:crypto'

jest.mock('jsonwebtoken', () =>({
  sign (): string {
    return 'any_token'
  }, 
  verify (): string {
    return 'decode_value'
  }
}))

function makeSut (): JwtAdapter {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id'}, 'secret')
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

  describe('verify()', () => {
    test('should call verify with correct values', () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('should return a decode value on verify success', () => {
      const sut = makeSut()
      const decodeValue = sut.decrypt('any_token')
      expect(decodeValue).toBe('decode_value')
    })
  })
})