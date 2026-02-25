import { Skeleton } from "@/components/ui/skeleton";

export default function AuthenticatedLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
        {/* Generic Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <Skeleton className="h-3 w-12 rounded" />
          <div className="size-3 flex items-center justify-center">
            <div className="size-1 bg-slate-200 rounded-full" />
          </div>
          <Skeleton className="h-3 w-20 rounded" />
        </div>

        {/* Generic Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Content area skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 h-64 animate-pulse" />
      </div>
    </div>
  );
}
