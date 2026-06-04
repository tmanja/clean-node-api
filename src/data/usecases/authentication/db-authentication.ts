import { Authentication, Credentials } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/cryptography/hash-comparer";
import { TokenGenerator } from "../../protocols/cryptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth(credentials: Credentials): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (account) {
      const passwordAreEquals = await this.hashComparer.compare(credentials.password, account.password)
      if (passwordAreEquals) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        return accessToken
      }
    }
    return null
  }
}