import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../factories/signup/signup";

export default function (router: Router) {
  router.post('/signup',  adaptRoute(makeSignUpController()))
}