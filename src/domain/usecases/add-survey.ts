export interface SurveyAnswer {
  image?: string,
  answer: string,
}

export interface Survey {
  question: string,
  answers: SurveyAnswer[],
  date: Date
}

export interface AddSurvey {
  add(survey: Survey): Promise<void>
}