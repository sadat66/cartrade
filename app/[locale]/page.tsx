import { prisma } from "@/lib/db";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { PromoCards } from "@/components/landing/promo-cards";
import { FeaturedCars } from "@/components/landing/featured-cars";
import { Footer } from "@/components/landing/footer";

export default async function Home() {
  const listings = await prisma.listing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 relative">
        <Hero />
        <section className="pt-32 md:pt-36">
          <PromoCards />
          <FeaturedCars listings={listings} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
