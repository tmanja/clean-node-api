import jwt from 'jsonwebtoken'
import { Encrypter } from "../../../data/protocols/cryptography/encrypter";

export class JwtAdapter implements Encrypter {
  private readonly secretKey: string
  constructor (secretKey: string) {
    this.secretKey = secretKey
  }
  encrypt(value: string): string {
    jwt.sign({ id: value }, this.secretKey)
    return null as unknown as string
  }
}