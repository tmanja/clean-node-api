import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from "./db-add-account-protocols"


export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(addAccountModel: AddAccountModel): Promise<AccountModel | null> {
    await this.loadAccountByEmailRepository.loadByEmail(addAccountModel.email)
    const hashedPassword = await this.hasher.hash(addAccountModel.password)
    const account = await this.addAccountRepository.add({
      ...addAccountModel,
      password: hashedPassword
    })
    return account
  }
}