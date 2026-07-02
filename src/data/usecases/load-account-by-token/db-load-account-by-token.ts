import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { Decrypter } from "../../protocols/cryptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}
  async loadByToken(accessToken: string, role?: string): Promise<AccountModel | null> {
    this.decrypter.decrypt(accessToken)
    return Promise.resolve(null)
  }
}