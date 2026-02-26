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
import type { Listing, SavedListing } from "@prisma/client";

import { Breadcrumb } from "@/components/shared/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

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

  let savedWithResolved: (SavedListing & { listing: Listing })[] = [];
  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: user.id },
      include: {
        listing: true,
      },
      orderBy: { createdAt: "desc" },
    });
    savedWithResolved = saved.map((item) => ({
      ...item,
      listing: resolveListing(item.listing),
    }));
  } catch (error) {
    console.error("Failed to fetch saved listings:", error);
    savedWithResolved = [];
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
      <Breadcrumb
        items={[
          { label: t("cars.breadcrumb.home"), href: "/" },
          { label: t("dashboard.saved.title") }
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard.saved.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.saved.carCount", { count: savedWithResolved.length })}
        </p>
      </div>

      {savedWithResolved.length === 0 ? (
        <p className="text-muted-foreground">
          {t("dashboard.saved.empty")}{" "}
          <Link href="/" className="font-medium text-primary underline">
            {t("dashboard.saved.featuredCars")}
          </Link>{" "}
          {t("dashboard.saved.andClickHeart")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedWithResolved.map((item) => {
            const { listing } = item;
            return (
            <Link key={listing.id} href={`/cars/${listing.id}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3] bg-muted">
                  {listing.imageUrls[0] ? (
                    <Image
                      src={listing.imageUrls[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {t("common.noImage")}
                    </div>
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5">
                    <Heart className="size-4 fill-red-500 text-red-500" />
                  </span>
                </div>
                <CardContent className="p-4">
                  <p className="font-semibold">{listing.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {listing.make} {listing.model} · {listing.year}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <span className="font-bold">
                    ${Number(listing.price).toLocaleString()}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
          })}
        </div>
      )}
    </div>
  );
}
