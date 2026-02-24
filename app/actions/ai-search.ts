"use server";

import { parseSearchQuery } from "@/lib/groq";
import { redirect } from "next/navigation";

export async function aiSearchAction(locale: string, query: string) {
    if (!query.trim()) return;

    const { filters, message } = await parseSearchQuery(query);
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
            params.append(key, value.toString());
        }
    });

    if (message) {
        params.append("aiMessage", message);
    }

    redirect(`/${locale}/cars?${params.toString()}`);
}
