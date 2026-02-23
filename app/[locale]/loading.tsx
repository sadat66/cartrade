import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedCarsSkeleton } from "@/components/landing/featured-cars-skeleton";
import { PromoCardsSkeleton } from "@/components/landing/promo-cards-skeleton";

export default function LocaleLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 relative">
        {/* Hero placeholder – matches hero height so layout doesn't jump */}
        <section className="relative min-h-[400px] w-full bg-muted md:min-h-[450px] flex flex-col">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="container mx-auto relative z-10 px-4 mt-auto pb-0 md:px-6">
            <div className="w-full max-w-7xl mx-auto -mb-24 md:-mb-28">
              <Skeleton className="h-24 w-full max-w-2xl rounded-lg" />
            </div>
          </div>
        </section>
        <section className="pt-32 md:pt-36">
          <PromoCardsSkeleton />
          <FeaturedCarsSkeleton />
        </section>
      </main>
    </div>
  );
}
