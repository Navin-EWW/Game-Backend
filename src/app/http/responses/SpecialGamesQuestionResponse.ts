import { SpecialGamesQuestion, Prisma, SpecialGamesCategory } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";
interface Question {
  id: string;
  SpecialGamesCategory: {
    id: string;
    name: string;
  };
  question: string;
  questionTypeView: string;
  correctAnswer: string;
  correctAnswerMedia: string;
  layoutTepmplate: number;
  class: string;
  image: string[];
  video: string[];
  audio: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Optional property
}

export const SpecialGamesQuestionResponse = (
  data: Question | Question[]
) => {
  if (Array.isArray(data)) {
    return data.map((question) => objectResponse(question));
  }

  return objectResponse(data);
};

const objectResponse = (question: Question) => {
  return {
    id: question.id,
    categoryId: {
      id:question.SpecialGamesCategory.id,
      name:question.SpecialGamesCategory.name
    },
    question: question.question,
    correctAnswer: question.correctAnswer,
    correctAnswerMedia: ImageUrlChange(question.correctAnswerMedia),
    questionTypeView: question.questionTypeView,
    layoutTemplate: question.layoutTepmplate,
    class: question.class,
    media: {
      Image: question.image.map(ImageUrlChange),
      Video: question.video.map(ImageUrlChange),
      Audio: question.audio.map(ImageUrlChange),
    },
    status: question.status,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
    deletedAt: question.deletedAt,
  };
};
