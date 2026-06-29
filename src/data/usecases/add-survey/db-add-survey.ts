import { AddSurvey, AddSurveyRepository, Survey } from "./db-add-survey-protocols";

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add(survey: Survey): Promise<void> {
    await this.addSurveyRepository.add(survey)
  }
}