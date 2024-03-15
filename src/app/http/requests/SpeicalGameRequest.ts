import { AnserGiveByTeam, Class, Team } from "@prisma/client";
import { array, mixed, number, object, string } from "yup";

export const SpeicalGameRequestSchema = object({
    gameName: string().required(),
    teamOneName: string().required(),
    teamTwoName: string().required(),
    teamOnePlayers: number().required().positive().integer(),
    teamTwoPlayers: number().required().positive().integer(),
    categoryId: string().required().required()
});

export const SpeicalGameBoardRequestSchema = object({
    gameId: string().required()
})

export const SpeicalGameQuestionRequestSchema = object({
    gmaeId: string().required(),
    categoryId: string().required(),
    teamClass: mixed<Class>().oneOf(Object.values(Class)),
    buttonTeam: mixed<Team>().oneOf(Object.values(Team)),
})

export const SpeicalGameAnswerSumbmitRequestSchema = object({
    gameId: string().required(),
    questionId: string().required(),
    answerGivenBy: mixed<AnserGiveByTeam>().oneOf(Object.values(AnserGiveByTeam)),
})

const LifelineType = {
    X2: 'X2',
    Flip: 'Flip',
    Call: 'Call'
}
export const SpeicalGameLifelineRequestSchema = object({
    gameId: string().required(),
    team: mixed<Team>().oneOf(Object.values(Team)),
    lifeline: string().required(),
})


export const SpeicalGameExitRequestSchema = object({
    gameId: string().required(),
})

export const SpeicalGameShuffleRequestSchema = object({
    gameId: string().required(),
    team: mixed<Team>().oneOf(Object.values(Team))
})