import { Decrypter } from "../../protocols/cryptography/decrypter"
import { DbLoadAccountByToken } from "./db-load-account-by-token"

describe('DbLoadAccountByToken', () => {
  test('should call Decrypter with correct value', async () => {
    class DecrypterStub implements Decrypter {
      decrypt(encryptedValue: string): string {
        return 'any_value'
      }
    }
    const decrypterStub = new DecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})