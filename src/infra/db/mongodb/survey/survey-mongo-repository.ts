import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { AddSurveyRepository, Survey } from "../../../../data/usecases/add-survey/db-add-survey-protocols";
import { SurveyModel } from "../../../../domain/models/survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add(survey: Survey): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys.map(MongoHelper.map<SurveyModel>)
  }
}