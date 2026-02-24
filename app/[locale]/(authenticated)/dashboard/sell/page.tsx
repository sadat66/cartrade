import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { resolveListing } from "@/lib/listing-images";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { MyListingsGrid } from "./my-listings-grid";
import { Plus } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export default async function MyListingsPage({ params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;
  const user = await getCurrentUser();
  if (!user) return null;
  const t = await getTranslations({ locale: validLocale });

  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const serializedListings = listings.map((listing) => ({
    ...resolveListing(listing),
    price: Number(listing.price),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("dashboard.myListings.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.myListings.listingCount", { count: serializedListings.length })}
          </p>
        </div>
        <Button asChild size="default" className="bg-primary hover:bg-primary/90 shrink-0">
          <Link href="/dashboard/sell/new" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            {t("dashboard.myListings.addListing")}
          </Link>
        </Button>
      </div>

      <MyListingsGrid
        listings={serializedListings}
        noImageLabel={t("common.noImage")}
        addListingHref="/dashboard/sell/new"
        addListingLabel={t("dashboard.myListings.addListing")}
        createFirstLabel={t("dashboard.myListings.noListingsYet")}
      />
    </div>
  );
}
