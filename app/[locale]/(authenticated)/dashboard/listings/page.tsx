import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { DeleteListingButton } from "@/components/listing/delete-listing-button";

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
          <p className="text-muted-foreground text-sm">
            {t("dashboard.myListings.listingCount", { count: listings.length })}
          </p>
        </div>
        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/listings/new">{t("dashboard.myListings.addListing")}</Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <p className="text-muted-foreground text-sm">
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
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {listings.map((listing: (typeof listings)[number], index: number) => (
            <Card
              key={listing.id}
              className="overflow-hidden transition-shadow hover:shadow-sm"
            >
              <CardContent className="p-2">
                <div className="flex gap-2">
                  <span className="flex h-8 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <Link
                    href={`/cars/${listing.id}`}
                    className="min-w-0 flex-1 flex gap-2"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-muted">
                      {listing.imageUrls[0] ? (
                        <Image
                          src={listing.imageUrls[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                          {t("common.noImage")}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{listing.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {listing.make} {listing.model} · {listing.year}
                      </p>
                      <p className="text-xs font-semibold">
                        ${Number(listing.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  <DeleteListingButton listingId={listing.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
