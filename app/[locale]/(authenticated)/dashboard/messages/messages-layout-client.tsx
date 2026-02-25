"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export function MessagesLayoutClient({
    conversations,
    children,
    currentUserId,
    translations: t,
}: {
    conversations: any[];
    children: React.ReactNode;
    currentUserId: string;
    translations: any;
}) {
    const pathname = usePathname();
    const isConversationOpen = pathname.match(/\/dashboard\/messages\/[^/]+/);

    return (
        <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-200/50">
            {/* Sidebar List */}
            <div className={cn(
                "flex w-full flex-col border-r border-slate-200 bg-slate-50/50 md:w-80 lg:w-96 shrink-0 relative",
                isConversationOpen ? "hidden md:flex" : "flex"
            )}>
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-white shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)] z-10 shrink-0">
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-800">{t.title}</h2>
                </div>
                <div className="flex-1 overflow-y-auto w-full">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                            <MessageCircle className="size-12 text-slate-300 mb-4" />
                            <p className="text-sm font-medium text-slate-500">{t.noConversations}</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {conversations.map((c: any) => {
                                const last = c.messages[0];
                                const other = currentUserId === c.buyerId ? c.seller : c.buyer;
                                const listing = c.listing;
                                const isActive = pathname === `/dashboard/messages/${c.id}`;

                                return (
                                    <li key={c.id}>
                                        <Link href={`/dashboard/messages/${c.id}`} className="block w-full outline-none">
                                            <div className={cn(
                                                "flex items-start gap-4 p-4 transition-all duration-200 hover:bg-slate-100/80 cursor-pointer w-full relative",
                                                isActive ? "bg-red-50/50 hover:bg-red-50/80 before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-[#ff385c]" : "bg-white"
                                            )}>
                                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 shadow-sm bg-slate-50">
                                                    {other.image ? (
                                                        <Image src={other.image} alt={other.name ?? "User"} fill className="object-cover" sizes="56px" />
                                                    ) : (
                                                        <span className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-400">
                                                            {(other.name ?? "?").charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1 overflow-hidden pt-0.5">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <p className="font-bold text-slate-900 truncate pr-2 text-[15px]">{other.name ?? t.unknown}</p>
                                                        {last && (
                                                            <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 font-semibold tracking-wide">
                                                                {new Date(last.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[#ff385c] text-[11px] font-bold uppercase tracking-wider truncate mb-1">
                                                        {t.re} {listing.title}
                                                    </p>
                                                    {last && (
                                                        <p className={cn("text-sm truncate pr-2", isActive ? "text-slate-700 font-medium" : "text-slate-500")}>
                                                            {last.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "flex flex-1 flex-col bg-slate-50/30 overflow-hidden relative",
                !isConversationOpen ? "hidden md:flex" : "flex"
            )}>
                {children}
            </div>
        </div>
    );
}
