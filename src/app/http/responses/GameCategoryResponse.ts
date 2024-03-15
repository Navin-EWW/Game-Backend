import { GamesCategory } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const GamesCategoryResponse = (data: GamesCategory | GamesCategory[]) => {
    if (Array.isArray(data)) {
        return data.map((d) => objectResponse(d));
    }

    return objectResponse(data);
};

const objectResponse = (category: GamesCategory) => {
    return {
        id: category.id,
        name: category.name,
        description: category.description,
        coverImage: ImageUrlChange(category.coverImage),
        status: category.status,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    };
}