import { PolicyPage } from "@prisma/client";

export const PolicyPageResponse = (data: PolicyPage | PolicyPage[]) => {
    if (Array.isArray(data)) {
        return data.map((d) => objectResponse(d));
    }

    return objectResponse(data);
};

const objectResponse = (page: PolicyPage) => {
    return {
        id: page.id,
        title: page.title,
        description: page.description,
        type: page.type,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt
    };
};
