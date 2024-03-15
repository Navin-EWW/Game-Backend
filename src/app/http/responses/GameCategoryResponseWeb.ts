import { GamesCategory } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const GamesCategoryResponseWeb = (data: any | any[]) => {
    if (Array.isArray(data)) {
        return data.map((d) => objectResponse(d));
    }

    return objectResponse(data);
};

const objectResponse = ({ category }: any) => {
    return {
        id: category._id.$oid,
        name: category.name,
        description: category.description,
        coverImage: ImageUrlChange(category.coverImage),
        status: category.status,
        createdAt: category.createdAt.$date,
        updatedAt: category.updatedAt.$date,
    };
};
