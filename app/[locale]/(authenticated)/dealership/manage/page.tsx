import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { DealershipManageClient } from "./manage-client";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function DealershipManagePage({ params }: Props) {
    const { locale } = await params;
    const validLocale: Locale =
        locale && routing.locales.includes(locale as Locale)
            ? (locale as Locale)
            : routing.defaultLocale;

    const user = await getCurrentUser();
    if (!user) {
        redirect({ href: "/login?next=/dealership/manage", locale: validLocale });
        return null;
    }

    const dealership = await prisma.dealership.findFirst({
        where: { ownerId: user.id },
        include: {
            vehicles: {
                orderBy: { createdAt: "desc" },
            },
            _count: { select: { vehicles: true } },
        },
    });

    if (!dealership) {
        redirect({ href: "/dealership/create", locale: validLocale });
        return null;
    }

    // Serialize for client component
    const serializedDealership = {
        ...dealership,
        vehicles: dealership.vehicles.map((v: any) => ({
            ...v,
            price: Number(v.price),
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
        })),
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
    };

    return <DealershipManageClient dealership={serializedDealership} />;
}
