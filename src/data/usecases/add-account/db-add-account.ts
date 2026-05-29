import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols"


export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository:AddAccountRepository 

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository =addAccountRepository 
  }

  async add(addAccountModel: AddAccountModel): Promise<AccountModel | null> {
    const encryptedPassword = await this.encrypter.encrypt(addAccountModel.password)
    const account = await this.addAccountRepository.add({
      ...addAccountModel,
      password: encryptedPassword
    })
    return account
  }
}