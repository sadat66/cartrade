import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getConversationWithMessages } from "@/app/actions/conversation";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageForm } from "./message-form";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/messages/" + id);

  const conv = await getConversationWithMessages(id);
  if (!conv) redirect("/dashboard/messages");

  const other = conv.buyerId === user.id ? conv.seller : conv.buyer;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href="/dashboard/messages"
        className="text-sm font-medium text-primary hover:underline"
      >
        ← Back to messages
      </Link>

      <Card>
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
              {other.image ? (
                <Image
                  src={other.image}
                  alt={other.name ?? "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                  {(other.name ?? "?").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold">{other.name ?? "Unknown"}</p>
              <Link
                href={`/cars/${conv.listing.id}`}
                className="text-muted-foreground text-sm hover:underline"
              >
                Re: {conv.listing.title}
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          <div className="space-y-3">
            {conv.messages.map((m) => {
              const isMe = m.senderId === user.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>
          <MessageForm conversationId={conv.id} />
        </CardContent>
      </Card>
    </div>
  );
}
