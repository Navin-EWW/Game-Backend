import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { AnserGiveByTeam, Class, GameCatgoryList, GameStatus, Games, GamesCategory, Status, Team, TeamWinner } from "@prisma/client";
import { GameHistoryIType, GamesHistoryResponse } from "../../../../responses/GameHistoryResponse";
import { GamesQuestionResponse } from "../../../../responses/GamesQuestionResponse";
import { GamesQuestionResponseWeb } from "../../../../responses/GameQuestionResponseWeb";


export class GameController {

    public static async startGame(req: Request, res: Response) {

        const { id } = req.body.auth.user
        const { gameName, teamOneName, teamTwoName, teamOnePlayers, teamTwoPlayers, categoriesId } = req.body.validatedData

        // const checkPackage=await packageAvailable(id)

        const game = await dbConnection.games.create({
            data: {
                userId: id,
                gameName,
                teamOneName,
                teamTwoName,
                teamOnePlayers,
                teamTwoPlayers,
                totalCategories: categoriesId.length,
                categoriesId: categoriesId,
                winnerTeam: null
            },

        })

        const totalQuestions = 36
        const totalCategories = categoriesId.length;
        const perCategoryQuestion = totalQuestions / totalCategories;//36/6 =6
        const perClassQuestion = Math.round(perCategoryQuestion / 3);//6/3=2

        const perTeamClassQuetion = Math.round(perClassQuestion / 2);//2/2=1
        console.log("Total Categories:", totalCategories);
        console.log("Total Questions:", totalQuestions);
        console.log("Questions per Category:", perCategoryQuestion);
        console.log("Questions per Class:", perClassQuestion);
        console.log("perTeamClassQuetion", perTeamClassQuetion);

        if (game) {
            const categoryValues: [] = categoriesId
            const data = categoryValues.map((category: any) => {
                console.log(category);

                return {
                    userId: id,
                    gameId: game.id,
                    categoryId: category,
                    TeamOneclass200QuestionCount: perTeamClassQuetion,
                    TeamOneclass200RemainingQuestionCount: perTeamClassQuetion,
                    TeamOneclass400QuestionCount: perTeamClassQuetion,
                    TeamOneclass400RemainingQuestionCount: perTeamClassQuetion,
                    TeamOneclass600QuestionCount: perTeamClassQuetion,
                    TeamOneclass600RemainingQuestionCount: perTeamClassQuetion,
                    TeamTwoclass200QuestionCount: perTeamClassQuetion,
                    TeamTwoclass200RemainingQuestionCount: perTeamClassQuetion,
                    TeamTwoclass400QuestionCount: perTeamClassQuetion,
                    TeamTwoclass400RemainingQuestionCount: perTeamClassQuetion,
                    TeamTwoclass600QuestionCount: perTeamClassQuetion,
                    TeamTwoclass600RemainingQuestionCount: perTeamClassQuetion
                }
            })

            console.log(data, "dasssssssssssss");
            const CategoriesList = await dbConnection.gameCatgoryList.createMany({
                data: data
            })
            if (CategoriesList) {
                return res.json({
                    status: true,
                    data: game,
                    message: req.t('crud.created', { model: 'Game' })
                });
            }


        }


    }

    public static async gameBoard(req: Request, res: Response) {
        const { id } = req.body.auth.user
        const { gameId } = req.body.validatedParamsData

        const gameBoard = await dbConnection.games.findFirst({
            where: {
                userId: id,
                id: gameId,
            },
            include: {

                GameCatgoryList: {
                    select: {
                        GamesCategory: {
                            select: {
                                id: true,
                                name: true,
                                coverImage: true
                            }
                        },
                        TeamOneclass200Available: true,
                        TeamOneclass400Available: true,
                        TeamOneclass600Available: true,
                        TeamTwoclass200Available: true,
                        TeamTwoclass400Available: true,
                        TeamTwoclass600Available: true,
                    }
                }
            }
        })

        if (gameBoard) {
            return res.json({
                status: true,
                data: gameBoard,
                message: req.t('crud.list', { model: 'Game Board' })
            });
        }
    }

    public static async gameQuestion(req: Request, res: Response) {
        const { id } = req.body.auth.user
        const { gameId, categoryId, teamClass, buttonTeam } = req.body.validatedData

        const findGame = await dbConnection.games.findFirst({
            where: {
                id: gameId,
                userId: id,
            },
            include: {
                GameCatgoryList: true
            }
        })
        console.log("findGame========>", findGame);
        let question: any = null
        let currentTeamclass = null
        if (findGame) {
            // if (findGame.currentTurn === 'TeamOne') {
            //     currentTeamclass = teamClass
            // } else {
            //     currentTeamclass = teamClass
            // }
            // console.log(currentTeamclass);
            question = await selectQustion(categoryId, teamClass, gameId)


            console.log("----------->", question);
            if (question) {

                await dbConnection.gameQuestionList.create({
                    data: {
                        gameId: gameId,
                        categoryId: categoryId,
                        questionId: question.id,
                        class: teamClass,
                        userId: id,
                        // teamOneClass: teamClass,
                        // teamTwoClass: teamClass
                    }
                })

                const gameCatgoryList: any = await dbConnection.gameCatgoryList.findFirst({
                    where: {
                        gameId: gameId,
                        categoryId: categoryId,
                        userId: id
                    }
                })
                if (gameCatgoryList) {
                    await updateGameClassAvailability(teamClass, gameCatgoryList, findGame, buttonTeam)
                } else {
                    return res.json({
                        status: false,
                        message: req.t("crud.not_found", { model: "Question Cateories" }),
                    });
                }

            } else {
                return res.json({
                    status: false,
                    message: req.t("crud.not_found", { model: "Question" }),
                });
            }

            await dbConnection.games.update({
                where: { id: gameId },
                data: {
                    currentQuestion: Number(findGame.currentQuestion + 1)
                }
            })


        } else {
            return res.json({
                status: false,
                message: req.t("crud.not_found", { model: "Game" }),
            });
        }

        console.log('================', question);

        return res.json({
            status: true,
            data: GamesQuestionResponseWeb(question),
            message: req.t('crud.list', { model: 'Question' })
        });
    }



    public static async answerSubmit(req: Request, res: Response) {
        const { id } = req.body.auth.user
        const { gameId, questionId, answerGivenBy, lifeLineQuestion } = req.body.validatedData
        const findGame = await dbConnection.games.findFirst({
            where: { id: gameId, userId: id }
        })

        if (answerGivenBy === AnserGiveByTeam.TeamOne && findGame?.teamOneFlipLifeline === true && lifeLineQuestion === true) {

            const findGameQuestion = await dbConnection.gameQuestionList.findFirst({
                where: {
                    questionId: questionId,
                    gameId: gameId
                }
            })
            const points: number = Number(findGameQuestion?.class.split("_")[1]) || 0
            await dbConnection.gameQuestionList.updateMany({
                where: { questionId: questionId, gameId: gameId },
                data: {
                    rightAnswerGivenByTeam: answerGivenBy,
                    points: points
                }
            })
            const currentTurn = await turnChange(findGame.currentTurn)
            await dbConnection.games.update({
                where: { id: gameId },
                data: {
                    currentTurn: currentTurn,
                    teamOnePoints: findGame.teamOnePoints + points,
                    teamTwoPoints: findGame.teamTwoPoints - points
                }
            })
        }

        if (answerGivenBy === AnserGiveByTeam.TeamTwo && findGame?.teamOneFlipLifeline === true && lifeLineQuestion === true) {

            const findGameQuestion = await dbConnection.gameQuestionList.findFirst({
                where: {
                    questionId: questionId,
                    gameId: gameId
                }
            })
            const points: number = Number(findGameQuestion?.class.split("_")[1]) || 0
            await dbConnection.gameQuestionList.updateMany({
                where: { questionId: questionId, gameId: gameId },
                data: {
                    rightAnswerGivenByTeam: answerGivenBy,
                    points: points
                }
            })
            const currentTurn = await turnChange(findGame.currentTurn)
            await dbConnection.games.update({
                where: { id: gameId },
                data: {
                    currentTurn: currentTurn,
                    teamTwoPoints: findGame.teamTwoPoints + points
                }
            })
        }

        if (answerGivenBy === AnserGiveByTeam.TeamOne && findGame?.teamTwoFlipLifeline === true && lifeLineQuestion === true) {
            console.log("calllllllllllllllllllllllllllllllllllll");

            const findGameQuestion = await dbConnection.gameQuestionList.findFirst({
                where: {
                    questionId: questionId,
                    gameId: gameId
                }
            })
            const points: number = Number(findGameQuestion?.class.split("_")[1]) || 0
            await dbConnection.gameQuestionList.updateMany({
                where: { questionId: questionId, gameId: gameId },
                data: {
                    rightAnswerGivenByTeam: answerGivenBy,
                    points: points
                }
            })
            const currentTurn = await turnChange(findGame.currentTurn)
            await dbConnection.games.update({
                where: { id: gameId },
                data: {
                    currentTurn: currentTurn,
                    teamOnePoints: findGame.teamOnePoints + points
                }
            })

        }
        
        if (answerGivenBy === AnserGiveByTeam.TeamTwo && findGame?.teamTwoFlipLifeline === true && lifeLineQuestion === true) {

            const findGameQuestion = await dbConnection.gameQuestionList.findFirst({
                where: {
                    questionId: questionId,
                    gameId: gameId
                }
            })
            const points: number = Number(findGameQuestion?.class.split("_")[1]) || 0
            await dbConnection.gameQuestionList.updateMany({
                where: { questionId: questionId, gameId: gameId },
                data: {
                    rightAnswerGivenByTeam: answerGivenBy,
                    points: points
                }
            })
            const currentTurn = await turnChange(findGame.currentTurn)
            await dbConnection.games.update({
                where: { id: gameId },
                data: {
                    currentTurn: currentTurn,
                    teamOnePoints: findGame.teamOnePoints - points,
                    teamTwoPoints: findGame.teamTwoPoints + points
                }
            })
        }

      
        if (answerGivenBy === AnserGiveByTeam.TeamOne && findGame?.teamOneFlipLifeline === false && lifeLineQuestion === false) {
            const findGameQuestion = await dbConnection.gameQuestionList.findFirst({
                where: {
                    questionId: questionId,
                    gameId: gameId
                }
            })
            const points: number = Number(findGameQuestion?.class.split("_")[1]) || 0
            await dbConnection.gameQuestionList.updateMany({
                where: { questionId: questionId, gameId: gameId },
                data: {
                    rightAnswerGivenByTeam: answerGivenBy,
                    points: points
                }
            })


            if (findGame) {
                const currentTurn = await turnChange(findGame?.currentTurn)
                const teamOnePoints = findGame.teamOnePoints + points

                await dbConnection.games.update({
                    where: {
                        id: gameId,
                    },
                    data: {
                        currentTurn: currentTurn,
                        teamOnePoints: teamOnePoints
                    }
                })
            }
            console.log(
                "find gameeeeeeeeeeeeeeeeeeeeeeeeee", findGame
            );

        }

        if (answerGivenBy === AnserGiveByTeam.TeamTwo && findGame?.teamTwoFlipLifeline === false && lifeLineQuestion === false) {
            const findGameQuestion = await dbConnection.gameQuestionList.findFirst({
                where: {
                    questionId: questionId,
                    gameId: gameId
                }
            })
            const points: number = Number(findGameQuestion?.class.split("_")[1]) || 0
            await dbConnection.gameQuestionList.updateMany({
                where: { questionId: questionId, gameId: gameId },
                data: {
                    rightAnswerGivenByTeam: answerGivenBy,
                    points: points
                }
            })

            if (findGame) {
                const currentTurn = await turnChange(findGame?.currentTurn)
                const teamTwoPoints = findGame.teamTwoPoints + points

                await dbConnection.games.update({
                    where: {
                        id: gameId,
                    },
                    data: {
                        currentTurn: currentTurn,
                        teamTwoPoints: teamTwoPoints
                    }
                })
            }
        }

        if (answerGivenBy === AnserGiveByTeam.NoOne) {
            const findGameQuestion = await dbConnection.gameQuestionList.findFirst({
                where: {
                    questionId: questionId,
                    gameId: gameId
                }
            })
            const points = 0
            await dbConnection.gameQuestionList.updateMany({
                where: { questionId: questionId, gameId: gameId },
                data: {
                    rightAnswerGivenByTeam: answerGivenBy,
                    points: points
                }
            })

            if (findGame) {
                const currentTurn = await turnChange(findGame.currentTurn)
                console.log("currentTurn[=======================>", currentTurn);

                await dbConnection.games.update({
                    where: {
                        id: gameId,
                    },
                    data: {
                        currentTurn: currentTurn
                    }
                })
            }
        }

        if (findGame?.currentQuestion === 36) {
            let winnerTeam
            if (findGame.teamOnePoints <= findGame.teamTwoPoints) {
                winnerTeam = TeamWinner.TeamTwo
            } else if (findGame.teamOnePoints >= findGame.teamTwoPoints) {
                winnerTeam = TeamWinner.TeamOne
            } else {
                winnerTeam = TeamWinner.Tie
            }

            await dbConnection.games.update({
                where: { id: findGame.id },
                data: { winnerTeam: winnerTeam, gameStatus: GameStatus.FINISHED }
            })
        }
        const game = await dbConnection.games.findFirst({
            where: { id: gameId }
        })
        return res.json({
            status: true,
            data: game,
            message: req.t('crud.list', { model: 'Game' })
        });
    }

    public static async gameLifeline(req: Request, res: Response) {
        const { id } = req.body.auth.user
        const { gameId, team, lifeline } = req.body.validatedData
        let data = {}
        if (team === Team.TeamOne) {
            if (lifeline === 'X2') {
                data = {
                    teamOneX2Lifeline: true
                }
            } else if (lifeline === 'Call') {
                data = {
                    teamOneCallLifeline: true
                }
            } else {
                data = {
                    teamOneFlipLifeline: true
                }
            }
        }

        if (team === Team.TeamTwo) {
            if (lifeline === 'X2') {
                data = {
                    teamTwoX2Lifeline: true
                }
            } else if (lifeline === 'Call') {
                data = {
                    teamTwoCallLifeline: true
                }
            } else {
                data = {
                    teamTwoFlipLifeline: true
                }
            }
        }
        const findGame = await dbConnection.games.update({
            where: { id: gameId },
            data: data
        })
        if (findGame) {
            return res.json({
                status: true,
                data: findGame,
                message: req.t('crud.list', { model: 'Game' })
            });
        } else {
            return res.json({
                status: false,
                message: req.t("crud.not_found", { model: "Game" }),
            });
        }

    }

    public static async gameExit(req: Request, res: Response) {
        const { id } = req.body.auth.user
        const { gameId } = req.body.validatedData
        const findGame = await dbConnection.games.findFirst({
            where: { id: gameId, userId: id }
        })


        if (findGame) {
            let winnerTeam
            if (findGame.teamOnePoints <= findGame.teamTwoPoints) {
                winnerTeam = TeamWinner.TeamTwo
            } else if (findGame.teamOnePoints >= findGame.teamTwoPoints) {
                winnerTeam = TeamWinner.TeamOne
            } else {
                winnerTeam = TeamWinner.Tie
            }

            const updateData = await dbConnection.games.update({
                where: { id: findGame.id },
                data: { winnerTeam: winnerTeam, gameStatus: GameStatus.FINISHED }
            })

            console.log("update", updateData);


            return res.json({
                status: true,
                data: updateData,
                message: req.t('crud.list', { model: 'Game' })
            });
        }
    }
    public static async gameShuffle(req: Request, res: Response) {
        const { id } = req.body.auth.user
        const { gameId, team } = req.body.validatedData


        const updateData = await dbConnection.games.update({
            where: { id: gameId },
            data: { currentTurn: team }
        })
        if (updateData) {
            const findGame = await dbConnection.games.findFirst({
                where: { id: gameId }
            })


            console.log("findGame", findGame);


            return res.json({
                status: true,
                data: findGame,
                message: req.t('crud.list', { model: 'Game' })
            });
        }
    }


    public static async gameHistory(req: Request, res: Response) {
        const { id } = req.body.auth.user

        const findGames: any = await dbConnection.games.aggregateRaw({
            pipeline: [
                {
                    '$match': {
                        'userId': { '$oid': id }
                    }
                }, {
                    '$lookup': {
                        'from': 'games_categories',
                        'localField': 'categoriesId',
                        'foreignField': '_id',
                        'as': 'categoriesId'
                    }
                }
            ]
        });
        console.log("findGames=", findGames);
        return res.json({
            status: true,
            data: GamesHistoryResponse(findGames),
            message: req.t('crud.list', { model: 'Game History' })
        });
    }
}

async function selectQustion(categoryId: string, classValue: Class, gameId: string) {
    const findQuestionListCount = await dbConnection.gameQuestionList.count(
        {
            where: { gameId: gameId }
        }
    )
    console.log("findQuestionListCount", findQuestionListCount);

    if (findQuestionListCount === 0) {
        console.log("-------------------", categoryId, classValue);

        const findQuestionsCount = await dbConnection.gamesQuestion.count({
            where: {
                class: classValue,
                categoryId: categoryId,
                deletedAt: null,
                status:Status.ACTIVE
            }
        })
        console.log(findQuestionsCount, "findQuestionsCount");

        const questionNumber = getRandomNumber(1, findQuestionsCount)

        console.log("questionNumber", questionNumber);

        const question = await dbConnection.gamesQuestion.findFirst({
            where: {
                class: classValue,
                categoryId: categoryId,
                deletedAt: null,
                status:Status.ACTIVE
            },
            skip: 0,
            take: questionNumber
        })
        console.log(question, "return");

        return question
    } else {
        const findQuestionList = await dbConnection.gameQuestionList.findMany({
            where: { gameId: gameId },
            select: {
                id: true,
                questionId: true// Select the ID field
            }
        });
        const findQuestionListIds = findQuestionList.map(question => question.questionId);

        console.log("findQuestionListIds=========================", findQuestionListIds);

        const findQuestionsCount = await dbConnection.gamesQuestion.count({
            where: {
                class: classValue,
                categoryId: categoryId,
                NOT: {
                    id: {
                        in: findQuestionListIds
                    }
                },
                deletedAt:null,
                status:Status.ACTIVE
            }
        })
        console.log(findQuestionsCount, "findQuestionsCount");

        const questionNumber = getRandomNumber(0, findQuestionsCount)

        console.log("questionNumber", questionNumber);

        const question = await dbConnection.gamesQuestion.findMany({
            where: {
                class: classValue,
                categoryId: categoryId,
                NOT: {
                    id: {
                        in: findQuestionListIds
                    }
                },
                deletedAt:null,
                status:Status.ACTIVE
            },
            skip: 0,
            take: 1
        })
        console.log(question, "return");

        return question[0]
    }
}



async function turnChange(team: Team) {
    let nextTurn
    if (team === 'TeamOne') {
        nextTurn = Team.TeamTwo
    } else {
        nextTurn = Team.TeamOne
    }
    return nextTurn
}

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateGameClassAvailability(teamClass: Class, gameCatgoryList: GameCatgoryList, findGame: Games, buttonTeam: Team) {
    console.log("gameCatgoryList", gameCatgoryList);
    const removeTeamClass = teamClass.split("_")[1];
    // const removeTeamTwoClass = TeamTwoClass.split("_")[1];
    const keyTeam = removeTeamClass as "200" | "400" | "600";
    // const keyTeamTwo = removeTeamTwoClass as "200" | "400" | "600";
    let data = {};
    console.log("buttonTeam------------------------------", buttonTeam);

    if (findGame.currentTurn === 'TeamOne') {
        const TeamOneRemainingQuestionCount = Number(gameCatgoryList[`TeamOneclass${keyTeam}RemainingQuestionCount`]) - 1;
        console.log(TeamOneRemainingQuestionCount, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>TeamOneRemainingQuestionCount");
        const TeamOneAvailable = TeamOneRemainingQuestionCount <= 0 ? false : true;
        data = {
            ...data,
            [`TeamOneclass${keyTeam}RemainingQuestionCount`]: TeamOneRemainingQuestionCount,
            [`${buttonTeam}class${keyTeam}Available`]: false
        };
    }

    if (findGame.currentTurn === 'TeamTwo') {
        const TeamTwoRemainingQuestionCount = Number(gameCatgoryList[`TeamTwoclass${keyTeam}RemainingQuestionCount`]) - 1;
        const TeamTwoAvailable = TeamTwoRemainingQuestionCount <= 0 ? false : true;
        console.log(TeamTwoRemainingQuestionCount, "TeamTwoRemainingQuestionCount");
        data = {
            ...data,
            [`TeamTwoclass${keyTeam}RemainingQuestionCount`]: TeamTwoRemainingQuestionCount,
            [`${buttonTeam}class${keyTeam}Available`]: false
        };
    }

    console.log(data, "data>>>>>>>>>>>>>>>>>>>>");

    if (Object.keys(data).length > 0) {
        const categoryListUpdate = await dbConnection.gameCatgoryList.update({
            where: {
                id: gameCatgoryList.id
            },
            data: data
        });
    }
}
