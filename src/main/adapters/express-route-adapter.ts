import { Request, Response } from "express"
import { Controller, HttpRequest } from "../../presentation/protocols"

export function adaptRoute (controller: Controller) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 || httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      const errorMessage = httpResponse.body.message
      res.status(httpResponse.statusCode).json({
        error: errorMessage
      })
    }
  }
}