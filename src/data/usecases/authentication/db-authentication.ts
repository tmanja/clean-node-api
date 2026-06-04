import { Authentication, CredentialModel } from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth(credential: CredentialModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(credential.email)
    return null
  }
}