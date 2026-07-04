import { AccountModel } from "../models/account"

export interface Survey {
  question: string,
  answers: SurveyAnswer[],
  date: Date
}

export interface SurveyAnswer {
  image?: string,
  answer: string,
}

export interface AddSurvey {
  add(survey: Survey): Promise<void>
}