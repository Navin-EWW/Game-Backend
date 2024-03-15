import { Status } from "@prisma/client";
import { mixed, object, string } from "yup";

export const BlogsRequest = object({
  title: string().required(),
  description: string().required(),
  image: string().required(),
});

export const UpdateBlogsRequest = object({
  title: string().optional(),
  description: string().optional(),
  image: string().optional(),
});

export const ViewBlogsRequest = object({
  slug: string().required(),
});

export const BlogsStatusRequest = object({
  status: string().required(),
});

export const BlogFilterRequest = object({
  search: string().optional(),
  toDate: string().trim().optional(),
  fromDate: string().trim().optional(),
  status: mixed<Status>().oneOf(Object.values(Status)).optional(),
});
