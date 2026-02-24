import { prisma } from "@/lib/db";
import { Hero } from "@/components/landing/hero";
import { BodyTypeFilter } from "@/components/landing/body-type-filter";
import { PromoCards } from "@/components/landing/promo-cards";
import { FeaturedCars } from "@/components/landing/featured-cars";
import { resolveListing } from "@/lib/listing-images";
import { Footer } from "@/components/landing/footer";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

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

  const listings = await prisma.listing.findMany({
    where: { 
      status: "active",
      ...(bodyType ? { bodyType: { equals: bodyType, mode: 'insensitive' } } : {})
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const resolvedListings = listings.map((l: any) => ({
    ...resolveListing(l),
    price: Number(l.price)
  }));
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 relative">
        <Hero />
        <section className="pt-16 md:pt-20">
          {/* <PromoCards locale={validLocale} /> */}
          <BodyTypeFilter />
          <FeaturedCars listings={resolvedListings} locale={validLocale as string} />
        </section>
      </main>
      <Footer locale={validLocale} />
    </div>
  );
}
