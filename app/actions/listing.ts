"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const MAX_PHOTOS = 3;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_SINGLE_BYTES = Math.floor(3.3 * 1024 * 1024); // ~3.3MB per image
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getPhotoFiles(formData: FormData): File[] {
  const files: File[] = [];
  for (let i = 1; i <= MAX_PHOTOS; i++) {
    const file = formData.get(`photo${i}`) as File | null;
    if (file && file.size > 0) files.push(file);
  }
  return files;
}

export async function createListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in" };

  const title = (formData.get("title") as string)?.trim();
  const make = (formData.get("make") as string)?.trim();
  const model = (formData.get("model") as string)?.trim();
  const year = parseInt((formData.get("year") as string) ?? "0", 10);
  const mileageRaw = (formData.get("mileage") as string)?.trim();
  const mileage = mileageRaw ? parseInt(mileageRaw, 10) : null;
  const price = parseFloat((formData.get("price") as string) ?? "0");
  const description = (formData.get("description") as string)?.trim() ?? null;
  const location = (formData.get("location") as string)?.trim() || null;
  const latRaw = (formData.get("latitude") as string)?.trim();
  const lngRaw = (formData.get("longitude") as string)?.trim();
  const latitude = latRaw ? parseFloat(latRaw) : null;
  const longitude = lngRaw ? parseFloat(lngRaw) : null;
  const bodyType = (formData.get("bodyType") as string)?.trim() || null;

  if (!title || !make || !model || !year || price <= 0) {
    return { error: "Title, make, model, year and price are required" };
  }

  const photoFiles = getPhotoFiles(formData);
  if (photoFiles.length > MAX_PHOTOS) {
    return { error: `Maximum ${MAX_PHOTOS} photos allowed` };
  }
  const totalBytes = photoFiles.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    return { error: "Total photo size must be 10MB or less" };
  }
  for (const f of photoFiles) {
    if (f.size > MAX_SINGLE_BYTES) {
      return { error: "Each photo must be 3.3MB or less" };
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      return { error: "Only JPEG, PNG and WebP images are allowed" };
    }
  }

  const listing = await prisma.listing.create({
    data: {
      userId: user.id,
      title,
      make,
      model,
      year,
      mileage,
      price,
      description,
      location,
      latitude,
      longitude,
      bodyType: bodyType || undefined,
      imageUrls: [],
    },
  });

  const imageUrls: string[] = [];
  if (photoFiles.length > 0) {
    const supabase = await createClient();
    const bucket = "profile-pictures"; // re-use existing bucket; listing photos under listings/
    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ["jpeg", "jpg", "png", "webp"].includes(ext) ? ext : "jpg";
      const filePath = `listings/${user.id}/${listing.id}/${i}.${safeExt}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        console.error("Error uploading listing photo:", uploadError);
        return { error: "Error uploading photos" };
      }
      imageUrls.push(filePath);
    }
    await prisma.listing.update({
      where: { id: listing.id },
      data: { imageUrls },
    });
  }

  revalidatePath("/seller/listings");
  revalidatePath("/");
  return { listingId: listing.id };
}

export async function deleteListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in" };

  const listingId = (formData.get("listingId") as string)?.trim();
  if (!listingId) return { error: "Missing listing" };

  const listing = await prisma.listing.findFirst({
    where: { id: listingId, userId: user.id },
  });
  if (!listing) return { error: "Listing not found" };

  await prisma.listing.delete({ where: { id: listingId } });

  revalidatePath("/seller/listings");
  revalidatePath("/");
  return { success: true };
}
