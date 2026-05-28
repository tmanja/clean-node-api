import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock('bcrypt', () => ({
async hash (): Promise<string> {
  return Promise.resolve('encrypted_value')
}
}))

const salt = 12

function makeSut (): BcryptAdapter {
return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
test('should call bcrypt with correct values', async () => {
  const sut = makeSut()
  const hashSpy = jest.spyOn(bcrypt, 'hash')
  await sut.encrypt('any_value')
  expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
})

test('should return an encrypted value on success', async () => {
  const sut = makeSut()
  const encryptedValue = await sut.encrypt('any_value')
  expect(encryptedValue).toBe('encrypted_value')
})

test('should throw if bcrypt throws', async () => {
  const sut = makeSut()
  jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error()));
  const encryptedValuePromise = sut.encrypt('any_value')
  await expect(encryptedValuePromise).rejects.toThrow()
})
})