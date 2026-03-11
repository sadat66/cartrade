import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12 animate-in fade-in-0 duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs">
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-3 w-3 rounded-full shrink-0" />
        <Skeleton className="h-3 w-10 rounded" />
        <Skeleton className="h-3 w-3 rounded-full shrink-0" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>

      {/* Title */}
      <div className="mb-8">
        <Skeleton className="h-10 md:h-12 w-3/4 max-w-2xl rounded-xl" />
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left - Images, stats, About this car, Car details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-lg" />
            ))}
          </div>

          {/* About this car - no card */}
          <div>
            <Skeleton className="h-5 w-32 mb-3 rounded" />
            <Skeleton className="h-4 w-full mb-2 rounded" />
            <Skeleton className="h-4 w-full mb-2 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          {/* Car details tabs - no card */}
          <div>
            <Skeleton className="h-5 w-28 mb-3 rounded" />
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-8 w-16 rounded" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between gap-4">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-40 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Price card (with badge), stats, seller, actions; then location */}
        <div className="space-y-6 sticky top-28 pb-12 self-start">
          <Card className="border-0 shadow-xl rounded-3xl bg-white ring-1 ring-slate-200/50 overflow-hidden">
            <div className="bg-slate-900 border-b-4 border-slate-700 p-6 pb-8">
              <Skeleton className="h-4 w-24 mb-2 bg-slate-700 rounded" />
              <Skeleton className="h-12 w-36 bg-slate-700 rounded mb-3" />
              <Skeleton className="h-6 w-28 rounded-full bg-slate-700" />
            </div>
            <CardContent className="p-6 pt-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
              {/* Seller row */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-14 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <div className="rounded-3xl overflow-hidden">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Similar picks */}
      <div className="mt-12 lg:mt-16">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Skeleton className="h-6 w-40 rounded" />
          <div className="flex gap-1">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 w-[85%] sm:w-[45%] lg:w-[23.5%] shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
