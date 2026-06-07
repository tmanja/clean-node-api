import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { Controller } from "../../../presentation/protocols";
import { makeLoginValidation } from "./login-validations-factory";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter/jwt-adapter";
import env from "../../config/env";

export function makeLoginController (): Controller {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecretKey)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}