import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeSignUpController } from "../factories/controllers/signup/signup-controller-factory";
import { makeLoginController } from "../factories/controllers/login/login-controller-factory";

export default function (router: Router) {
  router.post('/signup',  adaptRoute(makeSignUpController()))
  router.post('/login',  adaptRoute(makeLoginController()))
}