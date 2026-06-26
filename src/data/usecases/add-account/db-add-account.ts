import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from "./db-add-account-protocols"


export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(addAccountModel: AddAccountModel): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(addAccountModel.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(addAccountModel.password)
      const newAccount = await this.addAccountRepository.add({
        ...addAccountModel,
        password: hashedPassword
      })
      return newAccount
    }
    return null
  }
}