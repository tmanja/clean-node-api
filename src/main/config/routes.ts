import { Express, Router } from "express";
import FastGlob from "fast-glob";


export default function (app: Express): void {
  const router = Router()
  app.use('/api', router)
  FastGlob.sync('**/src/main/routes/**routes.ts').map(async file => {
    const route = (await import(`../../../${file}`)).default
    route(router)
  })
}