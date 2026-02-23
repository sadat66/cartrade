/**
 * Cloudinary config for car images.
 * Use next-cloudinary components (CldImage, CldUploadWidget) in your components.
 */
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
};

export function getCloudinaryUrl(publicId: string, options?: { width?: number; height?: number; crop?: string }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  const opts = options ?? { crop: "fill" };
  const w = opts.width ?? 800;
  const h = opts.height ?? 600;
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${opts.crop ?? "fill"},w_${w},h_${h}/${publicId}`;
}
