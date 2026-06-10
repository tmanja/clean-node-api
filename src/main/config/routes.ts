import { Express, Router } from "express";
import loginRoutes from "../routes/login-routes";

export default function (app: Express): void {
  const router = Router()
  app.use('/api', router)
  loginRoutes(router)
}