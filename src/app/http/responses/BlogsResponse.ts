import { Blogs } from "@prisma/client";

export const BlogResponse = (data: Blogs | Blogs[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (blog: Blogs) => {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    image: blog.image,
    status: blog.status,
    description: blog.description,
    createdAt: blog.createdAt,
  };
};
