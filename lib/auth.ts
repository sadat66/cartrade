import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

/**
 * Get the current app User from Supabase session.
 * Uses React cache to deduplicate this call across multiple components in the same request.
 */
export const getCurrentUser = cache(async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.warn("Supabase auth error:", authError);
      return null;
    }

    if (!authUser) return null;

    try {
      // Optimistically check for user in DB
      const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
      });

      if (!user) {
        // Create new user if not found
        try {
          return await prisma.user.create({
            data: {
              authId: authUser.id,
              email: authUser.email ?? "",
              name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
              image: authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? null,
            },
          });
        } catch (createError) {
          console.error("Failed to create user:", createError);
          return null;
        }
      }

      // Check if we need to sync metadata (only if changed)
      const metaName = authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null;
      const metaImage = authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? null;

      if (
        (metaName && metaName !== user.name) ||
        (metaImage && metaImage !== user.image)
      ) {
        try {
          return await prisma.user.update({
            where: { id: user.id },
            data: {
              name: metaName ?? user.name,
              image: metaImage ?? user.image,
            },
          });
        } catch (updateError) {
          console.error("Failed to update user:", updateError);
          return user; // Return existing user if update fails
        }
      }

      return user;
    } catch (dbError) {
      console.error("Database error in getCurrentUser:", dbError);
      return null;
    }
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
});
