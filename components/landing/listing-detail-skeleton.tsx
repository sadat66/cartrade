import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12 animate-in fade-in-0 duration-500">
      {/* Title Section Skeleton */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 md:h-14 w-3/4 rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-40 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Images and Description (Left - 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Skeleton className="aspect-[16/9] w-full rounded-2xl shadow-lg ring-1 ring-slate-200/50" />
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl shadow-sm ring-1 ring-slate-200/50" />
              ))}
            </div>
          </div>

          <Card className="border border-slate-200/60 shadow-md rounded-2xl">
            <CardContent className="p-6 md:p-8 space-y-4">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </CardContent>
          </Card>
        </div>

        {/* Action Panel / Specifics (Right - 1/3) */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl rounded-3xl bg-white ring-1 ring-slate-200/50 overflow-hidden">
            <div className="bg-slate-900 border-b-4 border-slate-700 p-6 pb-8">
              <Skeleton className="h-4 w-24 mb-4 bg-slate-700" />
              <Skeleton className="h-12 w-48 bg-slate-700" />
            </div>
            <CardContent className="p-6 pt-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-3xl overflow-hidden ring-1 ring-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
