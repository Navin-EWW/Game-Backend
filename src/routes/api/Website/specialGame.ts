import { Router } from "express";
import { RequestParamsValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { userVerifyToken } from "../../../app/http/middleware/Auth";
import { GameController } from "../../../app/http/controllers/api/Website/Game/GameController";
import { SpeicalGameAnswerSumbmitRequestSchema, SpeicalGameBoardRequestSchema, SpeicalGameExitRequestSchema, SpeicalGameLifelineRequestSchema, SpeicalGameQuestionRequestSchema, SpeicalGameRequestSchema, SpeicalGameShuffleRequestSchema } from "../../../app/http/requests/SpeicalGameRequest";
import { SpecialGameController } from "../../../app/http/controllers/api/Website/SpecialGame/SpecialGameController";


const router = Router();

router.post(
    "/start-game",
    userVerifyToken,
    RequestValidator(SpeicalGameRequestSchema),
    SpecialGameController.startGame
);

router.get(
    "/game-board/:gameId",
    userVerifyToken,
    RequestParamsValidator(SpeicalGameBoardRequestSchema),
    SpecialGameController.gameBoard
);

router.post(
    "/game-question",
    userVerifyToken,
    RequestValidator(SpeicalGameQuestionRequestSchema),
    SpecialGameController.gameQuestion
);

router.post(
    "/answer-submit",
    userVerifyToken,
    RequestValidator(SpeicalGameAnswerSumbmitRequestSchema),
    SpecialGameController.answerSubmit
);

router.post(
    "/game-lifeline",
    userVerifyToken,
    RequestValidator(SpeicalGameLifelineRequestSchema),
    SpecialGameController.gameLifeline
);


router.post(
    "/game-exit",
    userVerifyToken,
    RequestValidator(SpeicalGameExitRequestSchema),
    SpecialGameController.gameExit
);


router.get(
    "/game-shuffle",
    userVerifyToken,
    RequestValidator(SpeicalGameShuffleRequestSchema),
    SpecialGameController.gameShuffle
);



router.get(
    "/game-history",
    userVerifyToken,
    GameController.gameHistory
)
export default router;