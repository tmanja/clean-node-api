import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne({ _id: insertedId })
    if (account) {
      const { _id, name, email, password } = account
      return {
        id: _id.toString(),
        name,
        email,
        password
      }
    }
    return null
  }
}