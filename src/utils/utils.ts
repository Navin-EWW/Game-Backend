import { env } from "../env";
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_IMAGE_TYPE,
  ALLOWED_VIDEO_TYPE,
  ALLOWED_AUDIO_TYPE,
  UPLOAD_TYPES,
} from "./types";

export const queueConnection = {
  connection: {
    host: env.redis.host,
    port: env.redis.port,
  },
};

export const pagination = (
  totalCount: number,
  perPage: number,
  page: number
) => {
  return {
    total: totalCount,
    per_page: perPage,
    current_page: page,
    last_page: Math.ceil(totalCount / perPage),
  };
};

export const randomPasswordGenerator = () => {
  return Math.random().toString(36).slice(-8);
};

export const validFileTypes = (type: UPLOAD_TYPES) => {
  if (type === UPLOAD_TYPES.IMAGE) {
    return ALLOWED_IMAGE_TYPE;
  } else if (type === UPLOAD_TYPES.VIDEO) {
    return ALLOWED_VIDEO_TYPE;
  } else if (type === UPLOAD_TYPES.FILE) {
    return ALLOWED_FILE_TYPES;
  } else if (type === UPLOAD_TYPES.AUDIO) {
    return ALLOWED_AUDIO_TYPE;
  } else if (type === UPLOAD_TYPES.IMAGE_AUDIO_VIDEO) {
    return [...ALLOWED_IMAGE_TYPE, ...ALLOWED_VIDEO_TYPE, ...ALLOWED_AUDIO_TYPE];
  }
  return [];
};




export const STORAGE_PATH = env.app.root_dir + "/storage/uploads";

export const createSlug = (title: string) => {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (alphanumeric, underscores, and hyphens)
    .trim() // Remove leading and trailing whitespaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-"); // Replace consecutive hyphens with a single hyphen
};


export const ImageUrlChange = (url: string) => {
  const urlValue = url.split("/");
  const image = urlValue[urlValue.length - 1];
  if (image === '') {
    return url
  }
  const newUrl = `${env.aws.cloudfront_url}/${image}`;
  return newUrl;
};

