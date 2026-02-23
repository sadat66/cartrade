import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { getConversationsForUser } from "@/app/actions/conversation";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const conversations = await getConversationsForUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Your conversations with buyers and sellers
        </p>
      </div>

      {conversations.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-4 py-16">
          <MessageCircle className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground text-center">
            No conversations yet. Contact a seller from a listing to start.
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            Browse listings
          </Link>
        </Card>
      ) : (
        <ul className="space-y-2">
          {conversations.map((c) => {
            const last = c.messages[0];
            const other = user.id === c.buyerId ? c.seller : c.buyer;
            const listing = c.listing;
            return (
              <li key={c.id}>
                <Link href={`/dashboard/messages/${c.id}`}>
                  <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                      {other.image ? (
                        <Image
                          src={other.image}
                          alt={other.name ?? "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-lg font-medium text-muted-foreground">
                          {(other.name ?? "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {other.name ?? "Unknown"}
                      </p>
                      <p className="text-muted-foreground text-sm truncate">
                        Re: {listing.title}
                      </p>
                      {last && (
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          {last.content}
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
