import { AccountModel, AddAccount, AddAccountModel, Encrypter } from "./db-add-account-protocols"


export class DbAddAccount implements AddAccount {
  private readonly encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(addAccountModel.password)
    return new Promise(resolve => resolve({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }))
  }
}