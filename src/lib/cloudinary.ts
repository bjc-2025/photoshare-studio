export const CLOUDINARY_UPLOAD_PRESET = 'photoshare';
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const getUploadUrl = (folder: string) =>
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
