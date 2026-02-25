import { prisma } from "@/lib/db";
import { Hero } from "@/components/landing/hero";
import { BodyTypeFilter } from "@/components/landing/body-type-filter";
import { PromoCards } from "@/components/landing/promo-cards";
import { FeaturedCars } from "@/components/landing/featured-cars";
import { resolveListing } from "@/lib/listing-images";
import { Footer } from "@/components/landing/footer";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

import { BudgetSection } from "@/components/landing/budget-section";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bodyType?: string }>;
};

export default async function Home({ params, searchParams }: Props) {
  const { locale } = await params;
  const { bodyType } = await searchParams;
  
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  // Fetch all active listings to be used in both sections
  const allActiveListings = await prisma.listing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const resolvedAllListings = allActiveListings.map((l: any) => ({
    ...resolveListing(l),
    price: Number(l.price)
  }));

  // Featured listings based on bodyType filter
  const featuredListings = bodyType 
    ? resolvedAllListings.filter(l => l.bodyType?.toLowerCase() === bodyType.toLowerCase())
    : resolvedAllListings.slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 relative">
        <Hero />
        <section className="pt-16 md:pt-20">
          {/* <PromoCards locale={validLocale} /> */}
          <BodyTypeFilter />
          <FeaturedCars listings={featuredListings} locale={validLocale as string} />
          <BudgetSection listings={resolvedAllListings} />
        </section>
      </main>
      <Footer locale={validLocale} />
    </div>
  );
}
