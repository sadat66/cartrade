import { prisma } from "@/lib/db";
import { resolveListing } from "@/lib/listing-images";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import HomeClient from "./home-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  let locale: string;
  try {
    const resolvedParams = await params;
    locale = resolvedParams.locale;
  } catch (error) {
    console.error("Failed to resolve params:", error);
    locale = routing.defaultLocale;
  }
  
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  // Fetch all active listings with error handling
  let resolvedAllListings = [];
  try {
    const allActiveListings = await prisma.listing.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    resolvedAllListings = allActiveListings.map((l: any) => ({
      ...resolveListing(l),
      price: Number(l.price)
    }));
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    // Return empty array on error - the component will handle empty state
    resolvedAllListings = [];
  }

  return <HomeClient initialListings={resolvedAllListings} locale={validLocale as string} />;
}
