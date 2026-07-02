import { Decrypter } from "../../protocols/cryptography/decrypter"
import { DbLoadAccountByToken } from "./db-load-account-by-token"

function makeDecrypter (): Decrypter {
  class DecrypterStub implements Decrypter {
    decrypt(encryptedValue: string): string {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

function makeSut (): SutTypes {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})