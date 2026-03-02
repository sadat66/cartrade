"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getUnreadMessageCount } from "@/app/actions/conversation";

export function MessageBadge() {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchCount = useCallback(async () => {
        try {
            const count = await getUnreadMessageCount();
            setUnreadCount(count);
        } catch {
            // silently fail
        }
    }, []);

    // Poll for unread count every 30 seconds
    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [fetchCount]);

    return (
        <Link
            href="/messages"
            className="relative inline-flex items-center justify-center size-10 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
        >
            <MessageSquare className="size-5" />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-[#ff385c] rounded-full ring-2 ring-white animate-in zoom-in duration-200">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </Link>
    );
}
