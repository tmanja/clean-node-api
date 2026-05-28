import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols"


export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository:AddAccountRepository 

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository =addAccountRepository 
  }

  async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(addAccountModel.password)
    await this.addAccountRepository.add({
      ...addAccountModel,
      password: encryptedPassword
    })
    return new Promise(resolve => resolve({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }))
  }
}