import { Class, Status, questionTypeView } from "@prisma/client";
import { mixed, object, string } from "yup";

export const SpecialGameQuestionFilterRequest = object({
  search: string().optional(),
  toDate: string().trim().optional(),
  fromDate: string().trim().optional(),
  status: mixed<Status>().oneOf(Object.values(Status)).optional(),
  classValue: mixed<Class>().oneOf(Object.values(Class)),
  category: string().optional(),
  categoryId: string().optional(),
  questionTypeView: mixed<questionTypeView>().oneOf(Object.values(questionTypeView)),


});
