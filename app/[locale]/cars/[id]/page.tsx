import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSavedListingIds } from "@/app/actions/user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingActions } from "./listing-actions";
import { getTranslations } from "next-intl/server";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [listing, user, savedIds] = await Promise.all([
    prisma.listing.findUnique({
      where: { id, status: "active" },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
    getCurrentUser(),
    (async () => {
      const u = await getCurrentUser();
      return u ? getSavedListingIds(u.id) : Promise.resolve(new Set<string>());
    })(),
  ]);

  if (!listing) notFound();

  const t = await getTranslations();
  const isSaved = savedIds.has(listing.id);
  const isOwner = user?.id === listing.userId;
  const isLoggedIn = !!user;

  return (
    <div className="container max-w-4xl px-4 py-8 md:px-6">
      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3 space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            {listing.imageUrls[0] ? (
              <Image
                src={listing.imageUrls[0]}
                alt={listing.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                {t("common.noImage")}
              </div>
            )}
          </div>
          {listing.imageUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.imageUrls.slice(1, 5).map((url: string, i) => (
                <div
                  key={i}
                  className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground">
              {listing.make} {listing.model} · {listing.year}
              {listing.mileage != null && ` · ${listing.mileage.toLocaleString()} km`}
            </p>
            <p className="mt-2 text-2xl font-bold">
              ${Number(listing.price).toLocaleString()}
            </p>
          </div>

          <ListingActions
            listingId={listing.id}
            isSaved={isSaved}
            isOwner={isOwner}
            isLoggedIn={isLoggedIn}
            sellerId={listing.userId}
          />

          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm font-medium">{t("common.seller")}</p>
            </CardHeader>
            <CardContent className="flex items-center gap-3 pt-0">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                {listing.user.image ? (
                  <Image
                    src={listing.user.image}
                    alt={listing.user.name ?? t("common.seller")}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                    {(listing.user.name ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">{listing.user.name ?? t("common.seller")}</p>
              </div>
            </CardContent>
          </Card>

          {listing.description && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-semibold">{t("common.description")}</h2>
                <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
