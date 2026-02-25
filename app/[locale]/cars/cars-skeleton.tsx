import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ListingCardSkeleton } from "@/components/listing/listing-card";

export function FilterSectionSkeleton() {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <div className="w-full p-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="size-6 rounded-full" />
      </div>
    </div>
  );
}

export function FilterSidebarSkeleton() {
  return (
    <div className="bg-white flex flex-col h-full rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header Skeleton */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded" />
        </div>
        <Skeleton className="h-4 w-16 rounded" />
      </div>

      {/* Filter Sections Skeletons */}
      <div className="flex-1 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <FilterSectionSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CarsControlsSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <Skeleton className="h-10 w-48 rounded" />
            <Skeleton className="h-6 w-24 rounded mb-1" />
          </div>
          <Skeleton className="h-1.5 w-24 rounded-full" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl lg:hidden" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CarsPageSkeleton() {
  return (
    <div className="min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col py-6 pt-8 lg:pt-14">
        {/* Breadcrumbs Skeleton */}
        <div className="flex items-center gap-2 mb-6 shrink-0">
          <Skeleton className="h-3 w-12 rounded" />
          <div className="size-3 flex items-center justify-center">
            <div className="size-1 bg-slate-200 rounded-full" />
          </div>
          <Skeleton className="h-3 w-12 rounded" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:flex-1 lg:min-h-0">
          {/* Sidebar Skeleton - Desktop Only */}
          <aside className="hidden lg:block w-[300px] shrink-0 h-full">
            <FilterSidebarSkeleton />
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1 w-full lg:min-w-0 lg:h-full flex flex-col lg:min-h-0">
            <CarsControlsSkeleton />

            <div className="lg:flex-1 lg:overflow-y-auto scrollbar-hide pb-10">
              <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
