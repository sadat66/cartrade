import { Skeleton } from "@/components/ui/skeleton";
import { ListingCardSkeleton } from "@/components/listing/listing-card";

export function HeroSkeleton() {
  return (
    <section className="relative flex min-h-[420px] w-full flex-col items-center justify-center md:min-h-[500px] mb-8 md:mb-16 bg-slate-200 animate-pulse">
      <div className="container relative z-10 mx-auto px-4 pt-8 pb-16 text-center">
        <Skeleton className="mx-auto h-12 w-3/4 md:h-16 md:w-1/2 rounded-xl bg-white/20" />
        <Skeleton className="mx-auto mt-6 h-6 w-1/2 md:w-1/3 rounded-lg bg-white/20" />
      </div>
      <div className="absolute bottom-0 left-0 z-20 w-full translate-y-[65%]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-xl p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="flex gap-4 items-center">
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BodyTypeFilterSkeleton() {
  return (
    <div className="bg-white pt-12 pb-2">
      <div className="container mx-auto px-4 md:px-6">
        <Skeleton className="h-8 w-64 mb-10 rounded-lg" />
        <div className="flex flex-wrap items-end gap-x-8 md:gap-x-12 pb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center min-w-[50px]">
              <Skeleton className="h-14 w-24 md:h-16 md:w-28 mb-3 rounded-xl" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPromoCardsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between gap-4 mb-6">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
              <Skeleton className="size-20 md:size-24 rounded-2xl bg-slate-50" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BudgetSectionSkeleton() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <Skeleton className="h-8 w-3/4 max-w-lg mb-10 rounded-lg" />
        <div className="flex flex-wrap items-end gap-x-6 md:gap-x-10 mb-8 pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-20 rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {[1, 2, 3, 4].map((i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingFeaturedCarsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroSkeleton />
      <section className="pt-32 md:pt-36">
        <LandingPromoCardsSkeleton />
        <BodyTypeFilterSkeleton />
        <LandingFeaturedCarsSkeleton />
        <BudgetSectionSkeleton />
      </section>
    </div>
  );
}
