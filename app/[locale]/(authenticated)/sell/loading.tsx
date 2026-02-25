import { Skeleton } from "@/components/ui/skeleton";

export default function SellLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <Skeleton className="h-3 w-12 rounded" />
          <div className="size-3 flex items-center justify-center">
            <div className="size-1 bg-slate-200 rounded-full" />
          </div>
          <Skeleton className="h-3 w-16 rounded" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-11 w-64 rounded-xl" />
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="h-12 bg-slate-50/50 border-b border-slate-200" />
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-14 w-20 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="w-32 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="size-8 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
