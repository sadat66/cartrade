"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
      imageUrls: [], // Add Cloudinary upload later
    },
  });

  revalidatePath("/dashboard/sell");
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

  revalidatePath("/dashboard/sell");
  revalidatePath("/");
  return { success: true };
}
