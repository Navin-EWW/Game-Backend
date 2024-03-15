
import { questionTypeView } from "@prisma/client";
import { array, mixed, number, object, string } from "yup";

export const SpecialGameQuestionAddRequest = object({
  categoryId: string().required(),
  question: string().required(),
  correctAnswer: string().optional(),
  layoutTemplate: number().required(),
  classValue: string().required(),
  image: array().of(string()),
  video: array().of(string()),
  audio: array().of(string()),
  questionTypeView: mixed<questionTypeView>().oneOf(Object.values(questionTypeView)),
  correctAnswerMedia: string().optional().optional()
});
