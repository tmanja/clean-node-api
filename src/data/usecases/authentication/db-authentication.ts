import { Authentication, LoadAccountByEmailRepository, HashComparator, TokenGenerator, UpdateAccessTokenRepository, Credentials } from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparator
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparator,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth(credentials: Credentials): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (account) {
      const passwordAreEquals = await this.hashComparer.compare(credentials.password, account.password)
      if (passwordAreEquals) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}