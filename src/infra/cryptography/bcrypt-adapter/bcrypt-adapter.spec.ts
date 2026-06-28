import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed_value')
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const salt = 12

function makeSut (): BcryptAdapter {
return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hashed value on hash success', async () => {
    const sut = makeSut()
    const hashedValue = await sut.hash('any_value')
    expect(hashedValue).toBe('hashed_value')
  })

  test('should throw when hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error()));
    const hashedValuePromise = sut.hash('any_value')
    await expect(hashedValuePromise).rejects.toThrow()
  })

  test('should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => 
      Promise.resolve(false)
    )
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('should throw when compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() =>
      Promise.reject(new Error())
    );
    const isValidPromise = sut.compare('any_value', 'any_hash')
    await expect(isValidPromise).rejects.toThrow()
  })
})