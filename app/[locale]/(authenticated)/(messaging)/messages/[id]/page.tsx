import { redirect } from "@/i18n/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getConversationWithMessages } from "@/app/actions/conversation";
import { getCurrentUser } from "@/lib/auth";
import { MessageForm } from "./message-form";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { ArrowLeft, ExternalLink } from "lucide-react";

type Props = { params: Promise<{ locale: string; id: string }> };

type MessageItem = NonNullable<Awaited<ReturnType<typeof getConversationWithMessages>>>["messages"][number];

export default async function ConversationPage({ params }: Props) {
  const { id, locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  const user = await getCurrentUser();
  if (!user) return redirect({ href: "/login?next=/messages/" + id, locale: validLocale });

  const conv = await getConversationWithMessages(id);
  if (!conv) return redirect({ href: "/messages", locale: validLocale });

  const t = await getTranslations({ locale: validLocale });
  const other = conv.buyerId === user.id ? conv.seller : conv.buyer;

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative animate-in fade-in-0 duration-300">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white/95 p-4 px-6 backdrop-blur-md shadow-sm z-10 shrink-0">
        {/* Mobile Back Button */}
        <Link href="/messages" className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-sm bg-slate-50">
          {other.image ? (
            <Image src={other.image} alt={other.name ?? t("common.user")} fill className="object-cover" sizes="48px" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-400">
              {(other.name ?? other.email ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-bold text-slate-900 truncate">{other.name ?? t("dashboard.messages.unknown")}</p>
            <Link href={`/cars/${conv.listing.id}`} className="text-[#ff385c] hover:text-[#e03150] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5 truncate transition-colors">
              {t("dashboard.messages.re")} {conv.listing.title} <ExternalLink className="size-3 shrink-0" />
            </Link>
          </div>
          <Link href={`/cars/${conv.listing.id}`} className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
            {conv.listing.imageUrls[0] ? (
              <Image src={conv.listing.imageUrls[0]} alt={conv.listing.title} fill className="object-cover" sizes="64px" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-slate-400 text-xs">Car</span>
            )}
          </Link>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col justify-end bg-slate-50/50">
        <div className="flex flex-col space-y-4 pt-10">
          {conv.messages.length === 0 && (
            <div className="flex h-full items-center justify-center pt-20">
              <p className="text-sm font-medium text-slate-400 italic">No messages yet. Send a message to start the conversation.</p>
            </div>
          )}

          {conv.messages.map((m: MessageItem) => {
            const isMe = m.senderId === user!.id;
            const senderImage = isMe ? user!.image : other.image;
            const senderName = isMe ? user!.name : other.name;
            const senderEmail = isMe ? user!.email : other.email;
            const fallbackChar = (senderName ?? senderEmail ?? "?").charAt(0).toUpperCase();

            return (
              <div key={m.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} items-end gap-2 group`}>
                {!isMe && (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 mb-1 shadow-sm">
                    {senderImage ? (
                      <Image src={senderImage} alt={senderName ?? "User"} fill className="object-cover" sizes="32px" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                        {fallbackChar}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`relative max-w-[75%] md:max-w-[70%] px-5 py-3 text-[15px] shadow-sm leading-relaxed ${isMe
                    ? "bg-[#ff385c] text-white rounded-2xl rounded-br-sm shadow-[#ff385c]/10"
                    : "bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-bl-sm shadow-slate-200/40"
                    }`}
                >
                  {m.content}
                  <span className={`block text-[10px] font-bold uppercase tracking-wider mt-1.5 ${isMe ? 'text-red-100 text-right' : 'text-slate-400 text-left'}`}>
                    {new Date(m.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>

                {isMe && (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-red-200 bg-[#ff385c] mb-1 shadow-sm">
                    {senderImage ? (
                      <Image src={senderImage} alt={senderName ?? "User"} fill className="object-cover" sizes="32px" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                        {fallbackChar}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:px-6 md:py-5 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_25px_-15px_rgba(0,0,0,0.1)] relative z-20">
        <MessageForm conversationId={conv.id} />
      </div>

    </div>
  );
}
