import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DealershipsListClient } from "./dealerships-list-client";

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

    const dealerships = await (prisma as any).dealership.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { vehicles: true } },
            vehicles: {
                take: 10,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    price: true,
                    imageUrls: true,
                    year: true,
                    make: true,
                    model: true,
                    condition: true,
                }
            }
        },
    });

    const serialized = dealerships.map((d: any) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
        vehicles: d.vehicles.map((v: any) => ({
            ...v,
            price: Number(v.price),
        }))
    }));

    return (
        <div className="container mx-auto px-4 py-6 pt-8 lg:pt-14 md:px-6 space-y-6">
            <Breadcrumb
                items={[
                    { label: t("cars.breadcrumb.home"), href: "/" },
                    { label: t("header.dealerships") }
                ]}
            />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-[#1e293b]">
                        {t("header.dealerships")}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Browse local dealerships and their vehicle catalogs.
                    </p>
                </div>

                <DealershipsListClient dealerships={serialized} />
            </div>
        </div>
    );
}
