import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.myListings.title")}</h1>
          <p className="text-muted-foreground">
            {t("dashboard.myListings.listingCount", { count: listings.length })}
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/listings/new">{t("dashboard.myListings.addListing")}</Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <p className="text-muted-foreground">
          {t("dashboard.myListings.noListingsYet")}{" "}
          <Link
            href="/dashboard/listings/new"
            className="font-medium text-primary underline"
          >
            {t("dashboard.myListings.createFirst")}
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing: (typeof listings)[number]) => (
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
                  <span className="absolute right-2 top-2 rounded bg-background/80 px-2 py-0.5 text-xs font-medium">
                    {listing.status}
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
          ))}
        </div>
      )}
    </div>
  );
}
