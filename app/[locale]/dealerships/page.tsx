import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function DealershipsPage({ params }: Props) {
    const { locale } = await params;
    const validLocale: Locale =
        locale && routing.locales.includes(locale as Locale)
            ? (locale as Locale)
            : routing.defaultLocale;

    const t = await getTranslations({ locale: validLocale });

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-[#1e293b]">
                        {t("header.dealerships")}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Find the best local car dealerships near you.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Placeholder for dealerships list */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-xl font-semibold text-[#1e293b]">Example Motors</h2>
                        <p className="text-sm text-slate-500 mt-1">123 Street Name, City</p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Open Now
                            </span>
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                View Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
