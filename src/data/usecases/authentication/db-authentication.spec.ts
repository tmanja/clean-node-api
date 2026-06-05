import { DbAuthentication } from "./db-authentication"
import { AccountModel, Credentials, HashComparator, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from "./db-authentication-protocols"


function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password'
  }
}

function makeLoadAccountByEmailRepository (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount()) 
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

function makeHashComparator (): HashComparator {
  class HashComparerStub implements HashComparator {
    async compare(password: string, hash: string): Promise<boolean> {
      return Promise.resolve(true) 
    }
  }
  return new HashComparerStub()
}

function makeEncrypter (): Encrypter {
  class EncrypterStub implements Encrypter {
    encrypt(value: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

function makeUpdateAccessTokenRepository (): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    update(id: string, accessToken: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

function makeFakeCredentials (): Credentials {
  return {
    email: 'any_email@mail.com',
    password: 'any_password' 
  }
}

interface SutTypes {
  sut: DbAuthentication,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  hashComparerStub: HashComparator,
  encrypterStub: Encrypter,
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparator()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(loadSpy).toHaveBeenCalledWith(credentials.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(fakeError)
    const accessTokenPromise = sut.auth(makeFakeCredentials())
    await expect(accessTokenPromise).rejects.toThrow(fakeError)
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeCredentials())
    expect(accessToken).toBeNull()
  })

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const fakeCredentials = makeFakeCredentials()
    await sut.auth(fakeCredentials)
    expect(compareSpy).toHaveBeenCalledWith(
      fakeCredentials.password, 
      makeFakeAccount().password
    )
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(fakeError)
    const accessTokenPromise = sut.auth(makeFakeCredentials())
    await expect(accessTokenPromise).rejects.toThrow(fakeError)
  })

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(makeFakeCredentials())
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeCredentials())
    expect(encryptSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  test('should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(fakeError)
    const accessTokenPromise = sut.auth(makeFakeCredentials())
    await expect(accessTokenPromise).rejects.toThrow(fakeError)
  })

  test('should return an access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeCredentials())
    expect(accessToken).toBe('any_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeCredentials())
    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, 'any_token')
  })

  test('should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const fakeError = new Error()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockRejectedValueOnce(fakeError)
    const accessTokenPromise = sut.auth(makeFakeCredentials())
    await expect(accessTokenPromise).rejects.toThrow(fakeError)
  })
})