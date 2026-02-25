import { Skeleton } from "@/components/ui/skeleton";

export default function AuthenticatedLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6 shrink-0">
          <Skeleton className="h-3 w-12 rounded" />
          <div className="size-3 flex items-center justify-center">
            <div className="size-1 bg-slate-200 rounded-full" />
          </div>
          <Skeleton className="h-3 w-16 rounded" />
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <Skeleton className="h-10 w-56 rounded" />
                <Skeleton className="h-6 w-24 rounded mb-1" />
              </div>
              <Skeleton className="h-1.5 w-28 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="h-12 bg-slate-50/50 border-b border-slate-200" />
            <div className="divide-y divide-slate-100 p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
