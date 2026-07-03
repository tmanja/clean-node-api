import jwt from 'jsonwebtoken'
import { Encrypter } from "../../../data/protocols/cryptography/encrypter";
import { Decrypter } from '../../../data/protocols/cryptography/decrypter';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  encrypt(value: string): string {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  decrypt(encryptedValue: string): string | null {
    jwt.verify(encryptedValue, this.secret)
    return null
  }
}