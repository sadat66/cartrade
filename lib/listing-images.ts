/**
 * Listing image URLs – storage-agnostic for easy migration.
 *
 * - DB stores only the path (e.g. "listings/userId/listingId/0.jpg"), not full URLs.
 * - Base URL comes from env: NEXT_PUBLIC_LISTING_IMAGES_BASE_URL (optional).
 *   If unset, falls back to Supabase bucket URL. When you migrate storage (e.g. to S3/CloudFront),
 *   set this env to your new CDN/base URL and re-use the same paths.
 * - resolveListingImageUrls() turns paths into full URLs. Passes through existing full URLs
 *   so old DB rows keep working without migration.
 */

const LISTING_IMAGES_BUCKET = "profile-pictures";

function getListingImageBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_LISTING_IMAGES_BASE_URL;
  if (base) return base.replace(/\/$/, "");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";
  return `${supabaseUrl}/storage/v1/object/public/${LISTING_IMAGES_BUCKET}`;
}

/** Returns full URL for a single path. If value is already a full URL (http/https), returns as-is. */
export function getListingImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = getListingImageBaseUrl();
  if (!base) return pathOrUrl;
  return `${base}/${pathOrUrl.replace(/^\//, "")}`;
}

/** Resolve an array of paths/URLs to full URLs. Safe for existing DB rows that store full URLs. */
export function resolveListingImageUrls(pathsOrUrls: string[]): string[] {
  return pathsOrUrls.map(getListingImageUrl);
}

/** Resolve listing.imageUrls in place; returns a new object with resolved URLs. */
export function resolveListing<T extends { imageUrls: string[] }>(listing: T): T {
  return {
    ...listing,
    imageUrls: resolveListingImageUrls(listing.imageUrls),
  };
}
