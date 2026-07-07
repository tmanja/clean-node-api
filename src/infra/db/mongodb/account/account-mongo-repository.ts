import { MongoHelper } from "../helpers/mongo-helper";
import { ObjectId } from "mongodb";
import { AccountModel } from "@/domain/models/account";
import { AddAccountModel } from "@/domain/usecases/add-account";
import { AddAccountRepository } from "@/data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository copy";

export class AccountMongoRepository implements 
  AddAccountRepository, 
  LoadAccountByEmailRepository, 
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne({ _id: insertedId })
    return account ? MongoHelper.map<AccountModel>(account) : null
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account ? MongoHelper.map<AccountModel>(account) : null
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { accessToken }}
    )
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account ? MongoHelper.map<AccountModel>(account) : null
  }
}