import { makeAddSurveyValidation } from "./add-survey-validation-factory";
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbAddSurvey } from "@/main/factories/usecases/survey/add-survey/db-add-survey-factory";
import { AddSurveyController } from "@/presentation/controllers/survey/add-survey/add-survey-controller";
import { Controller } from "@/presentation/protocols";

export function makeAddSurveyController (): Controller {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}