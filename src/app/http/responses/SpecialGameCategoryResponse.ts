import { SpecialGamesCategory } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const SpecialGamesCategoryResponse = (
  data: SpecialGamesCategory | SpecialGamesCategory[]
) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (category: SpecialGamesCategory) => {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    amount: category.amount,
    coverImage: ImageUrlChange(category.coverImage),
    status: category.status,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    deleteAt: category.deletedAt,
  };
};
