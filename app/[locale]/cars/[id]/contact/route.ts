import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateConversation } from "@/app/actions/conversation";
import { routing } from "@/i18n/routing";

function getLocaleFromRequest(request: Request): string {
  const pathname = new URL(request.url).pathname;
  const segment = pathname.split("/")[1];
  return segment && routing.locales.includes(segment as "en" | "bn")
    ? segment
    : routing.defaultLocale;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listingId } = await params;
  const user = await getCurrentUser();
  const locale = getLocaleFromRequest(request);
  if (!user) redirect({ href: "/login?next=/cars/" + listingId, locale });
  const result = await getOrCreateConversation(listingId);
  if (result.error || !result.conversationId) {
    redirect({ href: "/cars/" + listingId, locale });
  }
  redirect({ href: "/dashboard/messages/" + result.conversationId, locale });
}
