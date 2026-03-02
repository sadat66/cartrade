"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, MessageSquare, Heart, Check, CheckCheck, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
    getNotifications,
    getUnreadNotificationCount,
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

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchCount = useCallback(async () => {
        try {
            const count = await getUnreadNotificationCount();
            setUnreadCount(count);
        } catch {
            // silently fail
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.read).length);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    // Poll for unread count every 30 seconds
    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [fetchCount]);

    // When dropdown opens, fetch full list
    useEffect(() => {
        if (open) fetchNotifications();
    }, [open, fetchNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [open]);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleMarkAllAsRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const handleDelete = async (id: string) => {
        const wasUnread = notifications.find((n) => n.id === id && !n.read);
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    function timeAgo(date: Date) {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "NEW_MESSAGE":
                return <MessageSquare className="size-4 text-blue-500" />;
            case "LISTING_SAVED":
                return <Heart className="size-4 text-pink-500" />;
            default:
                return <Bell className="size-4 text-slate-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative inline-flex items-center justify-center size-10 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Notifications"
            >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-[#ff385c] rounded-full ring-2 ring-white animate-in zoom-in duration-200">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[11px] font-bold text-[#ff385c] hover:text-[#e03150] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <CheckCheck className="size-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto max-h-[400px] divide-y divide-slate-50">
                        {loading && notifications.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="size-6 border-2 border-slate-200 border-t-[#ff385c] rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                    <Bell className="size-5 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">No notifications yet</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    We&apos;ll notify you about new messages and activity
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50",
                                        !notification.read && "bg-blue-50/40"
                                    )}
                                >
                                    {/* Icon */}
                                    <div className={cn(
                                        "mt-0.5 flex items-center justify-center size-8 rounded-full flex-shrink-0",
                                        notification.type === "NEW_MESSAGE" ? "bg-blue-100" : "bg-pink-100"
                                    )}>
                                        {getIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {notification.linkUrl ? (
                                            <Link
                                                href={notification.linkUrl}
                                                onClick={() => {
                                                    if (!notification.read) handleMarkAsRead(notification.id);
                                                    setOpen(false);
                                                }}
                                                className="block"
                                            >
                                                <p className={cn(
                                                    "text-[13px] leading-snug",
                                                    notification.read ? "text-slate-600" : "text-slate-900 font-bold"
                                                )}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                            </Link>
                                        ) : (
                                            <>
                                                <p className={cn(
                                                    "text-[13px] leading-snug",
                                                    notification.read ? "text-slate-600" : "text-slate-900 font-bold"
                                                )}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                            </>
                                        )}
                                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                                            {timeAgo(notification.createdAt)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                                title="Mark as read"
                                            >
                                                <Check className="size-3.5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="p-1 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-slate-100 px-4 py-2.5">
                            <Link
                                href="/notifications"
                                onClick={() => setOpen(false)}
                                className="block text-center text-[12px] font-bold text-[#ff385c] hover:text-[#e03150] transition-colors"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
