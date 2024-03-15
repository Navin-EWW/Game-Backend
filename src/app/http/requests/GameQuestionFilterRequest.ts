
import { Class, Status, questionTypeView } from "@prisma/client";
import { mixed, object, string } from "yup";

export const GameQuestionFilterRequest = object({
    search: string().optional(),
    toDate: string().trim().optional(),
    fromDate: string().trim().optional(),
    status: mixed<Status>().oneOf(Object.values(Status)).optional(),
    classValue: mixed<Class>().oneOf(Object.values(Class)),
    categoryId: string().optional(),
    questionTypeView: mixed<questionTypeView>().oneOf(Object.values(questionTypeView)),
});