import { HashComparator } from "@/data/protocols/cryptography/hash-comparator"
import { Hasher } from "@/data/protocols/cryptography/hasher"
import bcrypt from "bcrypt"

export class BcryptAdapter implements Hasher, HashComparator  {
  constructor (private readonly salt:number) {}

  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hash)
    return isValid
  }
}