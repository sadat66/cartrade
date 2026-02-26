import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { resolveListing } from "@/lib/listing-images";
import type { Locale } from "@/i18n/config";
import { Breadcrumb } from "@/components/shared/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

import { MySavedGrid } from "./my-saved-grid";

export default async function SavedListingsPage({ params }: Props) {
  let locale: string;
  try {
    const resolvedParams = await params;
    locale = resolvedParams.locale;
  } catch (error) {
    console.error("Failed to resolve params in SavedListingsPage:", error);
    locale = routing.defaultLocale;
  }

  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error("Failed to get user in SavedListingsPage:", error);
    return null;
  }

  if (!user) return null;

  let t;
  try {
    t = await getTranslations({ locale: validLocale });
  } catch (error) {
    console.error("Failed to get translations in SavedListingsPage:", error);
    return null;
  }

  let formattedListings: any[] = [];
  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: user.id },
      include: {
        listing: true,
      },
      orderBy: { createdAt: "desc" },
    });
    formattedListings = saved.map((item: any) => {
      const listing = resolveListing(item.listing);
      return {
        id: listing.id,
        title: listing.title,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        mileage: listing.mileage,
        price: Number(listing.price),
        imageUrls: listing.imageUrls,
        status: listing.status,
        bodyType: listing.bodyType,
        location: listing.location,
        createdAt: item.createdAt.toISOString()
      };
    });
  } catch (error) {
    console.error("Failed to fetch saved listings:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-8 min-h-[80vh]">
      <Breadcrumb
        items={[
          { label: t("cars.breadcrumb.home"), href: "/" },
          { label: t("dashboard.saved.title") }
        ]}
      />

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t("dashboard.saved.title")}</h1>
        <p className="text-sm font-bold text-slate-500">
          {t("dashboard.saved.carCount", { count: formattedListings.length })}
        </p>
      </div>

      <MySavedGrid
        listings={formattedListings}
        noImageLabel={t("common.noImage")}
        emptyTitle={t("dashboard.saved.title")}
        emptySubtitle={t("dashboard.saved.empty")}
        browseLabel={t("dashboard.saved.featuredCars")}
      />
    </div>
  );
}
