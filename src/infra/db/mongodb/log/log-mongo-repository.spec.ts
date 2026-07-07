import { LogMongoRepository } from "./log-mongo-repository";
import { MongoHelper } from "../helpers/mongo-helper";
import { Collection } from "mongodb";

function makeSut (): LogMongoRepository {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  });

  test('should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error_stack')
    const errorCollectionCount = await errorCollection.countDocuments()
    expect(errorCollectionCount).toBe(1)
  })
})