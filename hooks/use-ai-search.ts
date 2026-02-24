"use client";

import { useTransition } from "react";
import { parseSearchQuery } from "@/lib/groq";
import { useRouter } from "next/navigation";

export function useAiSearch() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAiSearch = async (query: string) => {
        if (!query.trim()) return;

        startTransition(async () => {
            try {
                const filters = await parseSearchQuery(query);
                const params = new URLSearchParams();

                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined) {
                        params.append(key, value.toString());
                    }
                });

                router.push(`/cars?${params.toString()}`);
            } catch (error) {
                console.error("AI Search Error:", error);
            }
        });
    };

    return { handleAiSearch, isPending };
}
