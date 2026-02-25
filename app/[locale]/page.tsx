import { prisma } from "@/lib/db";
import { resolveListing } from "@/lib/listing-images";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import HomeClient from "./home-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  // Fetch all active listings
  const allActiveListings = await prisma.listing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const resolvedAllListings = allActiveListings.map((l: any) => ({
    ...resolveListing(l),
    price: Number(l.price)
  }));

  return <HomeClient initialListings={resolvedAllListings} locale={validLocale as string} />;
}
