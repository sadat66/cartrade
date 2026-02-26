import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getConversationsForUser } from "@/app/actions/conversation";
import { MessagesLayoutClient } from "./messages-layout-client";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

import { Breadcrumb } from "@/components/shared/breadcrumb";

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
        <div className="min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-[#F8FAFC]">
            <div className="container mx-auto px-4 md:px-6 h-full flex flex-col py-6 pt-8 lg:pt-14 pb-10">
                <Breadcrumb 
                  items={[
                    { label: t("cars.breadcrumb.home"), href: "/" },
                    { label: t("dashboard.messages.title") }
                  ]}
                  className="mb-6 shrink-0"
                />
                <MessagesLayoutClient
                    conversations={conversations}
                    currentUserId={user.id}
                    translations={translations}
                >
                    {children}
                </MessagesLayoutClient>
            </div>
        </div>
    );
}
