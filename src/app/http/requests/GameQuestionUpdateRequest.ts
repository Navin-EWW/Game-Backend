import { Class, questionTypeView } from "@prisma/client";
import { array, mixed, number, object, string } from "yup";

export const GameQuestionUpdateRequest = object({
    categoryId: string().optional(),
    question: string().optional(),
    correctAnswer: string().optional(),
    layoutTemplate: number().optional(),
    classValue: mixed<Class>().oneOf(Object.values(Class)).optional(),
    image: array().of(string()),
    video: array().of(string()),
    audio: array().of(string()),
    description: string().optional(),
    questionTypeView: mixed<questionTypeView>().oneOf(Object.values(questionTypeView)),
    correctAnswerMedia: string().optional()
});