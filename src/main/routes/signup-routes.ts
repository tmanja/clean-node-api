import { Router } from "express";
import { makeSignUpController } from "../factories/signup/signup-factory";
import { adaptRoute } from "../adapters/express/express-route-adapter";

export default function (router: Router) {
  router.post('/signup',  adaptRoute(makeSignUpController()))
}