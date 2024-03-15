import { AnserGiveByTeam, Class, Team } from "@prisma/client";
import { array, boolean, mixed, number, object, string } from "yup";

export const GameRequestSchema = object({
    gameName: string().required(),
    teamOneName: string().required(),
    teamTwoName: string().required(),
    teamOnePlayers: number().required().positive().integer(),
    teamTwoPlayers: number().required().positive().integer(),
    categoriesId: array().of(string().required()).required()
});

export const GameBoardRequestSchema = object({
    gameId: string().required()
})

export const GameQuestionRequestSchema = object({
    gameId: string().required(),
    categoryId: string().required(),
    teamClass: mixed<Class>().oneOf(Object.values(Class)),
    buttonTeam: mixed<Team>().oneOf(Object.values(Team)),
})

export const GameAnswerSumbmitRequestSchema = object({
    gameId: string().required(),
    questionId: string().required(),
    answerGivenBy: mixed<AnserGiveByTeam>().oneOf(Object.values(AnserGiveByTeam)),
    lifeLineQuestion:boolean().required()
})

const LifelineType = {
    X2: 'X2',
    Flip: 'Flip',
    Call: 'Call'
}
export const GameLifelineRequestSchema = object({
    gameId: string().required(),
    team: mixed<Team>().oneOf(Object.values(Team)),
    lifeline: string().required(),
})


export const GameExitRequestSchema = object({
    gameId: string().required(),
})

export const GameShuffleRequestSchema = object({
    gameId: string().required(),
    team: mixed<Team>().oneOf(Object.values(Team))
})