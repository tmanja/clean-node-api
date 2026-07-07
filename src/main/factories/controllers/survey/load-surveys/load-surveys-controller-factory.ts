import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbLoadSurveys } from "@/main/factories/usecases/survey/load-surveys/db-load-surveys-factory";
import { LoadSurveysController } from "@/presentation/controllers/survey/load-surveys/load-surveys-controller";
import { Controller } from "@/presentation/protocols";

export function makeLoadSurveysController (): Controller {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}