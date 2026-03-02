"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Bell,
    MessageSquare,
    Heart,
    Check,
    CheckCheck,
    Trash2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "@/app/actions/notification";

type Notification = {
    id: string;
    type: string;
    title: string;
    body: string;
    linkUrl: string | null;
    read: boolean;
    createdAt: Date;
};

export function NotificationsPageClient() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleMarkAllAsRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleDelete = async (id: string) => {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filtered =
        filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

    function timeAgo(date: Date) {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "NEW_MESSAGE":
                return <MessageSquare className="size-5 text-blue-500" />;
            case "LISTING_SAVED":
                return <Heart className="size-5 text-pink-500" />;
            default:
                return <Bell className="size-5 text-slate-500" />;
        }
    };

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                            : "You're all caught up!"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm font-bold text-[#ff385c] hover:text-[#e03150] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <CheckCheck className="size-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
                <button
                    onClick={() => setFilter("all")}
                    className={cn(
                        "px-4 py-2 text-sm font-bold rounded-md transition-all cursor-pointer",
                        filter === "all"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={cn(
                        "px-4 py-2 text-sm font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                        filter === "unread"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Unread
                    {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-black text-white bg-[#ff385c] rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="size-8 border-2 border-slate-200 border-t-[#ff385c] rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Bell className="size-7 text-slate-400" />
                        </div>
                        <p className="text-base font-bold text-slate-600">
                            {filter === "unread"
                                ? "No unread notifications"
                                : "No notifications yet"}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            {filter === "unread"
                                ? "You've read all your notifications"
                                : "We'll notify you about new messages and activity on your listings"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "group flex items-start gap-4 px-5 py-4 transition-all hover:bg-slate-50",
                                    !notification.read && "bg-blue-50/30 border-l-2 border-l-[#ff385c]"
                                )}
                            >
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "mt-0.5 flex items-center justify-center size-10 rounded-full flex-shrink-0",
                                        notification.type === "NEW_MESSAGE"
                                            ? "bg-blue-100"
                                            : "bg-pink-100"
                                    )}
                                >
                                    {getIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {notification.linkUrl ? (
                                        <Link
                                            href={notification.linkUrl}
                                            onClick={() => {
                                                if (!notification.read)
                                                    handleMarkAsRead(notification.id);
                                            }}
                                            className="block"
                                        >
                                            <p
                                                className={cn(
                                                    "text-sm leading-snug",
                                                    notification.read
                                                        ? "text-slate-600"
                                                        : "text-slate-900 font-bold"
                                                )}
                                            >
                                                {notification.title}
                                            </p>
                                            <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-2">
                                                {notification.body}
                                            </p>
                                        </Link>
                                    ) : (
                                        <>
                                            <p
                                                className={cn(
                                                    "text-sm leading-snug",
                                                    notification.read
                                                        ? "text-slate-600"
                                                        : "text-slate-900 font-bold"
                                                )}
                                            >
                                                {notification.title}
                                            </p>
                                            <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-2">
                                                {notification.body}
                                            </p>
                                        </>
                                    )}
                                    <p className="text-[11px] text-slate-400 mt-1.5 font-semibold">
                                        {timeAgo(notification.createdAt)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 pt-1">
                                    {!notification.read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                            title="Mark as read"
                                        >
                                            <Check className="size-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Delete"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
