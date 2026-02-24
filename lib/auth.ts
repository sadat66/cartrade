import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

/**
 * Get the current app User from Supabase session.
 * Uses React cache to deduplicate this call across multiple components in the same request.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Optimistically check for user in DB
  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });

  if (!user) {
    // Create new user if not found
    return await prisma.user.create({
      data: {
        authId: authUser.id,
        email: authUser.email ?? "",
        name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
        image: authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? null,
      },
    });
  }

  // Check if we need to sync metadata (only if changed)
  const metaName = authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null;
  const metaImage = authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? null;

  if (
    (metaName && metaName !== user.name) ||
    (metaImage && metaImage !== user.image)
  ) {
    return await prisma.user.update({
      where: { id: user.id },
      data: {
        name: metaName ?? user.name,
        image: metaImage ?? user.image,
      },
    });
  }

  return user;
});
