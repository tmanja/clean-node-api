import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }
    if (!password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }
    return Promise.resolve(null as unknown as HttpResponse)
  }
}