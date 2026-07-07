import { Survey } from "@/domain/usecases/add-survey";

export interface AddSurveyRepository {
  add (survey: Survey): Promise<void> 
}