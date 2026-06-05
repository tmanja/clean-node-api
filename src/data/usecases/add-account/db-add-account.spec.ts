import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from "./db-add-account-protocols"

function makeHasher (): Hasher {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password'
  } 
}

function makeAddAccountRepository (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}


interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher,
  addAccountRepositoryStub:AddAccountRepository 
}

function makeSut (): SutTypes {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub: hasherStub,
    addAccountRepositoryStub
  }
  
}

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

describe('DbAddAccount usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    const fakeAccountData = makeFakeAccountData()
    await sut.add(fakeAccountData)
    expect(encryptSpy).toHaveBeenCalledWith(fakeAccountData.password)
  })

  test('should throws if Hasher throws ', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const accountPromise = sut.add(makeFakeAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const fakeAccountData = makeFakeAccountData()
    await sut.add(fakeAccountData)
    expect(addSpy).toHaveBeenCalledWith({
      ...fakeAccountData,
      password: 'hashed_password' 
    })
  })

  test('should throws if AddAccountRepository throws ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const accountPromise = sut.add(makeFakeAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})