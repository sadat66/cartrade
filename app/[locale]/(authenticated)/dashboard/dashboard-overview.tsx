import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Search, MessageCircle, User, Car } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import type { CurrentUser } from "@/lib/auth";
import { getConversationsForUser } from "@/app/actions/conversation";
import { prisma } from "@/lib/db";
import { resolveListing } from "@/lib/listing-images";

type SavedListingWithListing = {
  listing: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: unknown;
    imageUrls: string[];
  };
};

type ConversationItem = Awaited<ReturnType<typeof getConversationsForUser>>[number];

type Props = {
  user: NonNullable<CurrentUser>;
  locale: Locale;
};

export async function DashboardOverview({ user, locale }: Props) {
  const t = await getTranslations({ locale });
  const [saved, conversations] = await Promise.all([
    prisma.savedListing.findMany({
      where: { userId: user.id },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    getConversationsForUser(),
  ]);
  const savedWithResolved = saved.map((item) => ({
    ...item,
    listing: resolveListing(item.listing),
  }));
  const recentConversations = conversations.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard.overview.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.overview.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Welcome Back */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? t("common.avatar")}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xl font-medium text-muted-foreground">
                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle>{t("dashboard.overview.welcomeBack", { name: user.name ?? user.email })}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
              <Button asChild className="shrink-0 bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-full px-6 font-bold shadow-lg shadow-purple-900/10 transition-all active:scale-95">
                <Link href="/profile">{t("dashboard.overview.viewDetails")}</Link>
              </Button>
            </CardHeader>
          </Card>

          {/* My Saved Cars */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="size-5 text-red-500" />
                  {t("dashboard.saved.title")}
                </CardTitle>
                <CardDescription>
                  {t("dashboard.saved.carCount", { count: savedWithResolved.length })}
                </CardDescription>
              </div>
              {savedWithResolved.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/saved">{t("dashboard.overview.viewAll")}</Link>
                </Button>
              )}
            </CardHeader>
            {savedWithResolved.length === 0 ? (
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.saved.empty")}{" "}
                  <Link href="/" className="font-medium text-primary underline">
                    {t("dashboard.saved.featuredCars")}
                  </Link>{" "}
                  {t("dashboard.saved.andClickHeart")}
                </p>
              </CardContent>
            ) : (
              <>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {savedWithResolved.map(({ listing }: { listing: SavedListingWithListing["listing"] }) => (
                      <Link key={listing.id} href={`/cars/${listing.id}`}>
                        <div className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
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
                                <Car className="size-8" />
                              </div>
                            )}
                            <span className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5">
                              <Heart className="size-4 fill-red-500 text-red-500" />
                            </span>
                          </div>
                          <div className="p-3">
                            <p className="font-semibold text-sm truncate">{listing.title}</p>
                            <p className="text-muted-foreground text-xs">
                              {listing.make} {listing.model} · {listing.year}
                            </p>
                            <p className="font-bold text-sm">
                              ${Number(listing.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/saved">{t("dashboard.overview.viewAllSaved")}</Link>
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="size-5" />
                {t("dashboard.overview.recentSearches")}
              </CardTitle>
              <CardDescription>{t("dashboard.overview.recentSearchesDesc")}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">{t("dashboard.overview.refineSearch")}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Instant Cash Offer */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">{t("promo.instantCashTitle")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("promo.instantCashDesc")}
                </CardDescription>
              </div>
              <div
                className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                style={{
                  backgroundImage: "url(https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=160&q=80)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </CardHeader>
            <CardFooter>
              <Button className="w-full bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98]" asChild>
                <Link href="/sell-my-car">{t("promo.getOffer")}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* My Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="size-5" />
                {t("dashboard.messages.title")}
              </CardTitle>
              {recentConversations.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/messages">{t("dashboard.overview.viewAllMessages")}</Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {recentConversations.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.messages.noConversations")}{" "}
                  <Link href="/" className="font-medium text-primary hover:underline">
                    {t("dashboard.messages.browseListings")}
                  </Link>
                </p>
              ) : (
                <ul className="space-y-2">
                  {recentConversations.map((c: ConversationItem) => {
                    const other = user.id === c.buyerId ? c.seller : c.buyer;
                    const last = c.messages[0];
                    return (
                      <li key={c.id}>
                        <Link href={`/messages/${c.id}`}>
                          <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                              {other.image ? (
                                <Image
                                  src={other.image}
                                  alt={other.name ?? "User"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                                  {(other.name ?? other.email ?? "?").charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                              {c.listing.imageUrls[0] ? (
                                <Image
                                  src={c.listing.imageUrls[0]}
                                  alt={c.listing.title}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">Car</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">
                                {other.name ?? t("dashboard.messages.unknown")}
                              </p>
                              <p className="text-muted-foreground truncate text-xs">
                                {t("dashboard.messages.re")} {c.listing.title}
                              </p>
                              {last && (
                                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                                  {last.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
            {recentConversations.length > 0 && (
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/messages">{t("dashboard.overview.viewAllMessages")}</Link>
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                {t("dashboard.profile.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.profile.subtitle")}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile">{t("dashboard.overview.viewProfileSettings")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
