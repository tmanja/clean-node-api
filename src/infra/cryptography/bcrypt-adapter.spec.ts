import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('encrypted_value')
  }
}))

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return an encrypted value on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const encryptedValue = await sut.encrypt('any_value')
    expect(encryptedValue).toBe('encrypted_value')
  })
})