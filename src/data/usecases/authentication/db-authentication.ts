import { Authentication, LoadAccountByEmailRepository, HashComparator, Encrypter, UpdateAccessTokenRepository, Credentials } from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparator
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparator,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth(credentials: Credentials): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (account) {
      const passwordAreEquals = await this.hashComparer.compare(credentials.password, account.password)
      if (passwordAreEquals) {
        const accessToken = this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}