import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getConversationsForUser } from "@/app/actions/conversation";
import { MessagesLayoutClient } from "./messages-layout-client";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

export default async function MessagesLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const validLocale: Locale =
        locale && routing.locales.includes(locale as Locale)
            ? (locale as Locale)
            : routing.defaultLocale;

    const user = await getCurrentUser();
    if (!user) return null;

    const t = await getTranslations({ locale: validLocale });
    const conversations = await getConversationsForUser();

    const translations = {
        title: t("dashboard.messages.title"),
        noConversations: t("dashboard.messages.noConversations"),
        unknown: t("dashboard.messages.unknown"),
        re: t("dashboard.messages.re"),
    };

    return (
        <div className="pt-2 md:pt-4">
            <MessagesLayoutClient
                conversations={conversations}
                currentUserId={user.id}
                translations={translations}
            >
                {children}
            </MessagesLayoutClient>
        </div>
    );
}
