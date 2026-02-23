import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export default async function SavedListingsPage({ params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;
  const user = await getCurrentUser();
  if (!user) return null;
  const t = await getTranslations({ locale: validLocale });

  const saved = await prisma.savedListing.findMany({
    where: { userId: user.id },
    include: {
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard.saved.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.saved.carCount", { count: saved.length })}
        </p>
      </div>

      {saved.length === 0 ? (
        <p className="text-muted-foreground">
          {t("dashboard.saved.empty")}{" "}
          <Link href="/" className="font-medium text-primary underline">
            {t("dashboard.saved.featuredCars")}
          </Link>{" "}
          {t("dashboard.saved.andClickHeart")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((item: (typeof saved)[number]) => {
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
