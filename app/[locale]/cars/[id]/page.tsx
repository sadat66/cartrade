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
import { ListingLocationDisplay } from "@/components/listing/listing-location-display";
import { resolveListing } from "@/lib/listing-images";
import { Calendar, Gauge, MapPin, CarFront, FileText, BadgeCheck } from "lucide-react";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let listing, user, savedIds;
  try {
    [listing, user, savedIds] = await Promise.all([
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
  } catch (error) {
    console.error("Failed to fetch listing data:", error);
    notFound();
  }

  if (!listing) notFound();

  const resolvedListing = resolveListing(listing);
  const t = await getTranslations();
  const isSaved = savedIds.has(resolvedListing.id);
  const isOwner = user?.id === resolvedListing.userId;
  const isLoggedIn = !!user;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12 animate-in fade-in-0 duration-500">

      {/* Title Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
            <BadgeCheck className="size-3.5 mr-1" />
            Verified Listing
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">{resolvedListing.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-600 font-medium text-sm md:text-base">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg"><Calendar className="size-4 text-slate-500" /> {resolvedListing.year}</span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg"><Gauge className="size-4 text-slate-500" /> {resolvedListing.mileage?.toLocaleString() ?? "N/A"} km</span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg"><MapPin className="size-4 text-slate-500" /> {resolvedListing.location || "Location not specified"}</span>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Images and Description (Left - 2/3) */}
        <div className="lg:col-span-2 space-y-8">

          <div className="space-y-4">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-slate-200/50 group">
              {resolvedListing.imageUrls[0] ? (
                <Image
                  src={resolvedListing.imageUrls[0]}
                  alt={resolvedListing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-muted-foreground bg-slate-50">
                  <CarFront className="size-16 opacity-20 mb-4" />
                  <span className="text-lg font-medium">{t("common.noImage")}</span>
                </div>
              )}
            </div>

            {resolvedListing.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {resolvedListing.imageUrls.slice(1, 6).map((url: string, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted cursor-pointer group shadow-sm ring-1 ring-slate-200/50"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      sizes="(max-width: 1024px) 25vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          {resolvedListing.description && (
            <Card className="border border-slate-200/60 shadow-md overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                  <FileText className="size-6 text-[#3D0066]" />
                  {t("common.description")}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                  {resolvedListing.description}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Action Panel / Specifics (Right - 1/3) */}
        <div className="space-y-6 sticky top-28 pb-12 self-start">

          <Card className="border-0 shadow-xl overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/50">
            {/* Price Header */}
            <div className="bg-slate-900 border-b-4 border-[#3D0066] text-white p-6 pb-8 shadow-sm">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Asking Price</p>
              <div className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                ${Number(resolvedListing.price).toLocaleString()}
              </div>
            </div>

            <CardContent className="p-6 pt-8 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Make</p>
                  <p className="font-extrabold text-slate-900 text-lg truncate">{resolvedListing.make}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Model</p>
                  <p className="font-extrabold text-slate-900 text-lg truncate">{resolvedListing.model}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <ListingActions
                listingId={resolvedListing.id}
                isSaved={isSaved}
                isOwner={isOwner}
                isLoggedIn={isLoggedIn}
                sellerId={resolvedListing.userId}
              />
            </CardContent>
          </Card>

          {/* Seller Card */}
          <Card className="border-none shadow-md rounded-3xl overflow-hidden group hover:shadow-lg transition-transform hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 ring-1 ring-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md bg-slate-100">
                  {resolvedListing.user.image ? (
                    <Image
                      src={resolvedListing.user.image || ""}
                      alt={resolvedListing.user.name ?? t("common.seller")}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xl font-bold text-white">
                      {(resolvedListing.user.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#3D0066] uppercase tracking-wider mb-0.5">{t("common.seller")}</p>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3D0066] transition-colors truncate">{resolvedListing.user.name ?? t("common.seller")}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          {(resolvedListing.location || resolvedListing.latitude != null || resolvedListing.longitude != null) && (
            <Card className="border-none shadow-md rounded-3xl overflow-hidden ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 px-6 pt-5">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="size-5 text-[#3D0066]" />
                  Location
                </h3>
              </CardHeader>
              <CardContent className="p-6 relative z-0">
                <ListingLocationDisplay
                  location={resolvedListing.location}
                  latitude={resolvedListing.latitude}
                  longitude={resolvedListing.longitude}
                />
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
