export type SurveyAnswer = {
  image?: string,
  answer: string,
}

export type Survey = {
  question: string,
  answers: SurveyAnswer[],
  date: Date
}

export interface AddSurvey {
  add(survey: Survey): Promise<void>
}