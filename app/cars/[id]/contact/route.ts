import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateConversation } from "@/app/actions/conversation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listingId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cars/" + listingId);
  const result = await getOrCreateConversation(listingId);
  if (result.error || !result.conversationId) {
    redirect("/cars/" + listingId);
  }
  redirect("/dashboard/messages/" + result.conversationId);
}
