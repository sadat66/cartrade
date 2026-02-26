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
import { Breadcrumb } from "@/components/shared/breadcrumb";

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
    createdAt: listing.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
        <Breadcrumb
          items={[
            { label: t("cars.breadcrumb.home"), href: "/" },
            { label: t("dashboard.myListings.title") }
          ]}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {t("dashboard.myListings.title")}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {t("dashboard.myListings.listingCount", { count: serializedListings.length })}
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-6 font-bold shadow-lg shadow-purple-900/10 transition-all active:scale-95">
            <Link href="/sell-my-car" className="inline-flex items-center gap-2">
              <Plus className="size-5" />
              {t("dashboard.myListings.addListing")}
            </Link>
          </Button>
        </div>

        <MyListingsGrid
          listings={serializedListings}
          noImageLabel={t("common.noImage")}
          addListingHref="/sell-my-car"
          addListingLabel={t("dashboard.myListings.addListing")}
          createFirstLabel={t("dashboard.myListings.noListingsYet")}
        />
      </div>
    </div>
  );
}
