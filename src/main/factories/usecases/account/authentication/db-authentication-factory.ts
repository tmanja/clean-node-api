import { DbAuthentication } from "../../../../../data/usecases/authentication/db-authentication"
import { Authentication } from "../../../../../domain/usecases/authentication"
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account/account-mongo-repository"
import env from "../../../../config/env"

export function makeDbAuthentication (): Authentication {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecretKey)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}