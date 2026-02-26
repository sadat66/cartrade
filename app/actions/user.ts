"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in" };

  const name = (formData.get("name") as string)?.trim() ?? null;
  const phone = (formData.get("phone") as string)?.trim() ?? null;
  const location = (formData.get("location") as string)?.trim() ?? null;
  const bio = (formData.get("bio") as string)?.trim() ?? null;
  const imageFile = formData.get("image") as File | null;

  let imageUrl = undefined;

  if (imageFile && imageFile.size > 0) {
    const supabase = await createClient();
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { error: "Error uploading image" };
    }

    const { data } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      phone,
      location,
      bio,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function saveListing(listingId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in" };

  await prisma.savedListing.upsert({
    where: {
      userId_listingId: { userId: user.id, listingId },
    },
    create: { userId: user.id, listingId },
    update: {},
  });

  revalidatePath("/saved");
  revalidatePath("/cars/[id]", "page");
  return { success: true };
}

export async function unsaveListing(listingId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in" };

  await prisma.savedListing.deleteMany({
    where: { userId: user.id, listingId },
  });

  revalidatePath("/saved");
  revalidatePath("/cars/[id]", "page");
  return { success: true };
}

export async function getSavedListingIds(userId: string) {
  const saved = await prisma.savedListing.findMany({
    where: { userId },
    select: { listingId: true },
  });
  return new Set(saved.map((s: (typeof saved)[number]) => s.listingId));
}
