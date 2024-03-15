import { GamesCategory, GamesQuestion, Prisma } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";
interface Question {
    id: string;
    GameCategory: {
        id: string,
        name: string,
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

export const GamesQuestionResponse = (data: Question | Question[]) => {
    if (Array.isArray(data)) {
        return data.map((question) => objectResponse(question));
    }

    return objectResponse(data);
};

const objectResponse = (question: Question) => {
    return {
        id: question.id,
        categoryId: {
            id: question.GameCategory.id,
            name: question.GameCategory.name
        },
        question: question.question,
        questionTypeView: question.questionTypeView,
        correctAnswer: question.correctAnswer,
        correctAnswerMedia: ImageUrlChange(question.correctAnswerMedia),
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
        deletedAt: question.deletedAt
    };
};

