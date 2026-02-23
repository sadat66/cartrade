import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

/**
 * Get the current app User from Supabase session.
 * Creates a User in our DB if one doesn't exist (sync with Supabase Auth).
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  let user = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        authId: authUser.id,
        email: authUser.email ?? "",
        name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
        image: authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? null,
      },
    });
  } else if (
    authUser.user_metadata?.full_name !== undefined ||
    authUser.user_metadata?.avatar_url !== undefined
  ) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? user.name,
        image: authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? user.image,
      },
    });
  }

  return user;
}
