import { GamesCategory } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";
export interface GameHistoryIType {
    _id: {
        $oid: string
    };
    userId: {
        $oid: string
    };
    gameName: string;
    teamOneName: string;
    teamTwoName: string;
    teamOnePlayers: number;
    teamTwoPlayers: number;
    totalCategories: number;
    winnerTeam: string | null
    gameStatus: 'START' | 'IN_PROGRESS' | 'END'; // Assuming these are the possible statuses
    firstTurn: 'TeamOne' | 'TeamTwo'; // Assuming these are the possible values for first turn
    currentQuestion: number;
    currentTurn: 'TeamOne' | 'TeamTwo'; // Assuming these are the possible values for current turn
    teamOnePoints: number;
    teamTwoPoints: number;
    teamOneFlipLifeline: boolean;
    teamOneX2Lifeline: boolean;
    teamOneCallLifeline: boolean;
    teamTwoFlipLifeline: boolean;
    teamTwoX2Lifeline: boolean;
    teamTwoCallLifeline: boolean;
    createdAt: {
        $date: Date
    };
    updatedAt: {
        $date: Date
    };
    categoryId: {
        _id: {
            $oid: string
        };
        name: string;
        coverImage: string;
        description: string;
        status: 'ACTIVE' | 'INACTIVE';
        createdAt: {
            $date: Date
        };
        updatedAt: {
            $date: Date
        };
        deletedAt: Date | null;
    }[];
}

export const SpecialGamesHistoryResponse = (data: GameHistoryIType | GameHistoryIType[]) => {
    if (Array.isArray(data)) {
        return data.map((d) => objectResponse(d));
    }

    return objectResponse(data);
};

const objectResponse = (game: GameHistoryIType) => {
    return {
        id: game._id.$oid,
        userId: game.userId.$oid,
        gameName: game.gameName,
        teamOneName: game.teamOneName,
        teamTwoName: game.teamTwoName,
        gameStatus: game.gameStatus,
        createdAt: game.createdAt.$date,
        updatedAt: game.updatedAt.$date,
        winnerTeam: game.winnerTeam,
        teamOnePoints: game.teamOnePoints,
        teamTwoPoints: game.teamOnePoints,
        categories: game.categoryId.map(category => ({
            id: category._id.$oid,
            name: category.name,
            coverImage: ImageUrlChange(category.coverImage),
            description: category.description,
            status: category.status,
        }))
    };
};
