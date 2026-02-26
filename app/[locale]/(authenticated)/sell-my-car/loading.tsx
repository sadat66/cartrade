import { Skeleton } from "@/components/ui/skeleton";

export default function NewSellLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-6 shrink-0">
            <Skeleton className="h-3 w-12 rounded" />
            <div className="size-3 flex items-center justify-center">
              <div className="size-1 bg-slate-200 rounded-full" />
            </div>
            <Skeleton className="h-3 w-16 rounded" />
            <div className="size-3 flex items-center justify-center">
              <div className="size-1 bg-slate-200 rounded-full" />
            </div>
            <Skeleton className="h-3 w-20 rounded" />
          </div>

          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <Skeleton className="h-10 w-64 rounded" />
                <Skeleton className="h-6 w-32 rounded mb-1" />
              </div>
              <Skeleton className="h-1.5 w-36 rounded-full" />
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
