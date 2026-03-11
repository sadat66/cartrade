import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSavedListingIds } from "@/app/actions/user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ListingActions } from "./listing-actions";
import { AboutThisCar } from "./about-this-car";
import { CarDetailsTabs } from "./car-details-tabs";
import { SimilarPicks } from "./similar-picks";
import { getTranslations } from "next-intl/server";
import { ListingLocationDisplay } from "@/components/listing/listing-location-display";
import { resolveListing } from "@/lib/listing-images";
import { Calendar, Gauge, MapPin, CarFront, BadgeCheck, Settings2, Shield, Palette } from "lucide-react";

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
        include: { user: { select: { id: true, name: true, image: true, email: true } } },
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

  const similarListings = await prisma.listing.findMany({
    where: {
      status: "active",
      id: { not: id },
      make: resolvedListing.make,
      model: resolvedListing.model,
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
  const resolvedSimilar = similarListings.map((l) => {
    const resolved = resolveListing(l);
    return {
      id: resolved.id,
      title: resolved.title,
      make: resolved.make,
      model: resolved.model,
      year: resolved.year,
      mileage: resolved.mileage,
      price: Number(resolved.price),
      imageUrls: resolved.imageUrls,
      isDepositTaken: false,
      transmission: resolved.transmission,
      drivetrain: resolved.drivetrain,
    };
  });

  return (
    <div className="container mx-auto  px-4 py-8 md:px-6 lg:py-12 animate-in fade-in-0 duration-500">

      <Breadcrumb
        items={[
          { label: t("cars.breadcrumb.home"), href: "/" },
          { label: t("cars.breadcrumb.cars"), href: "/cars" },
          { label: resolvedListing.title },
        ]}
        className="mb-6"
      />

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{resolvedListing.title}</h1>
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
          <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-600 font-medium text-sm md:text-base">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg"><Calendar className="size-4 text-slate-500" /> {resolvedListing.year}</span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg"><Gauge className="size-4 text-slate-500" /> {resolvedListing.mileage?.toLocaleString() ?? "N/A"} km</span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg"><MapPin className="size-4 text-slate-500" /> {resolvedListing.location || "Location not specified"}</span>
          {resolvedListing.transmission && (
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Settings2 className="size-4 text-slate-500" />
              {t.has(`cars.transmissions.${resolvedListing.transmission.toLowerCase()}`) ? t(`cars.transmissions.${resolvedListing.transmission.toLowerCase()}`) : resolvedListing.transmission}
            </span>
          )}
          {resolvedListing.drivetrain && (
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Shield className="size-4 text-slate-500" />
              {t.has(`cars.drivetrains.${resolvedListing.drivetrain.toLowerCase()}`) ? t(`cars.drivetrains.${resolvedListing.drivetrain.toLowerCase()}`) : resolvedListing.drivetrain}
            </span>
          )}
          {resolvedListing.color && (
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Palette className="size-4 text-slate-500" />
              {t.has(`cars.colours.${resolvedListing.color.toLowerCase()}`) ? t(`cars.colours.${resolvedListing.color.toLowerCase()}`) : resolvedListing.color}
            </span>
          )}
        </div>

          {/* About this car - no border, no shadow */}
          {resolvedListing.description && (
            <AboutThisCar
              title={t("cars.aboutThisCar")}
              description={resolvedListing.description}
              showMoreLabel={t("cars.showMore")}
              showLessLabel={t("cars.showLess")}
            />
          )}

          {/* Car details - dummy Porsche Taycan content, no border, no shadow */}
          <CarDetailsTabs
            title={t("cars.carDetails")}
            overviewLabel={t("cars.tabs.overview")}
            featuresLabel={t("cars.tabs.features")}
            specificationsLabel={t("cars.tabs.specifications")}
            specLabels={{
              vehicleDescription: t("cars.specs.vehicleDescription"),
              powerplantType: t("cars.specs.powerplantType"),
              costToInsure: t("cars.specs.costToInsure"),
              bodyType: t("cars.specs.bodyType"),
              transmission: t("cars.specs.transmission"),
              engine: t("cars.specs.engine"),
              fuelConsumptionCombined: t("cars.specs.fuelConsumptionCombined"),
              registrationPlate: t("cars.specs.registrationPlate"),
              buildDate: t("cars.specs.buildDate"),
              checkWithSeller: t("cars.specs.checkWithSeller"),
              batteryCapacity: t("cars.specs.batteryCapacity"),
              electricRange: t("cars.specs.electricRange"),
              acceleration: t("cars.specs.acceleration"),
              topSpeed: t("cars.specs.topSpeed"),
            }}
          />

        </div>

        {/* Action Panel / Specifics (Right - 1/3) */}
        <div className="space-y-6 sticky top-28 pb-12 self-start">

          <Card className="border-0 py-0 shadow-xl overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/50">
            {/* Price Header + Verified badge */}
            <div className="bg-slate-900 border-b-4 border-[#3D0066] text-white p-6 pb-8 shadow-sm">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Asking Price</p>
              <div className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                ${Number(resolvedListing.price).toLocaleString()}
              </div>
              <span className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-semibold text-green-300 ring-1 ring-inset ring-green-400/30">
                <BadgeCheck className="size-3.5" />
                Verified Listing
              </span>
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
                {resolvedListing.transmission && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Transmission</p>
                    <p className="font-extrabold text-slate-900 text-lg truncate">
                      {t.has(`cars.transmissions.${resolvedListing.transmission.toLowerCase()}`) ? t(`cars.transmissions.${resolvedListing.transmission.toLowerCase()}`) : resolvedListing.transmission}
                    </p>
                  </div>
                )}
                {resolvedListing.drivetrain && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Drivetrain</p>
                    <p className="font-extrabold text-slate-900 text-lg truncate">
                      {t.has(`cars.drivetrains.${resolvedListing.drivetrain.toLowerCase()}`) ? t(`cars.drivetrains.${resolvedListing.drivetrain.toLowerCase()}`) : resolvedListing.drivetrain}
                    </p>
                  </div>
                )}
              </div>

              {/* Seller - above action buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
                  {resolvedListing.user.image ? (
                    <Image
                      src={resolvedListing.user.image || ""}
                      alt={resolvedListing.user.name ?? t("common.seller")}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-700 text-sm font-bold text-white">
                      {(resolvedListing.user.name ?? resolvedListing.user.email ?? "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t("common.seller")}</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{resolvedListing.user.name ?? t("common.seller")}</p>
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

          {/* Location Card */}
          {(resolvedListing.location || resolvedListing.latitude != null || resolvedListing.longitude != null) && (
            <Card className="border-none px-0 shadow-none rounded-3xl overflow-hidden ">
              
              <CardContent className=" px-0 relative z-0">
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

      {resolvedSimilar.length > 0 && (
        <SimilarPicks
          title={t("cars.similarCarsInStock")}
          listings={resolvedSimilar}
        />
      )}
    </div >
  );
}
