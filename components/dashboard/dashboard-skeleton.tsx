import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 pb-32 py-6 pt-8 lg:pt-14 relative min-h-screen">
      {/* Ambient Glow Skeleton */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* 1. Header Skeleton */}
      <section className="py-12 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-72 rounded-xl bg-slate-200/60" />
            <Skeleton className="h-6 w-36 rounded-full bg-slate-100" />
          </div>
          <Skeleton className="h-5 w-56 rounded-lg bg-slate-100" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl bg-slate-100" />
          <Skeleton className="h-12 w-48 rounded-2xl bg-[#3D0066]/10" />
        </div>
      </section>

      {/* 2. Metrics Skeleton */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-0 py-8 border-b border-slate-50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-8 py-6 border-l border-slate-100 first:border-0">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="size-8 rounded-xl bg-slate-100" />
              <Skeleton className="h-3 w-24 bg-slate-50" />
            </div>
            <div className="flex items-end gap-3">
              <Skeleton className="h-10 w-16 bg-slate-100" />
              <Skeleton className="h-3 w-12 bg-emerald-50" />
            </div>
          </div>
        ))}
      </section>

      {/* 3. Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
        {/* Inventory Wing */}
        <div className="lg:col-span-8 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-lg bg-slate-100" />
                <Skeleton className="h-6 w-40 bg-slate-100" />
              </div>
              <Skeleton className="h-4 w-24 bg-slate-50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/10] w-full rounded-[2.5rem] bg-slate-100" />
                  <div className="px-2 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-slate-100" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-24 bg-slate-50" />
                      <Skeleton className="h-4 w-16 bg-slate-50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watchlist Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-lg bg-slate-100" />
                <Skeleton className="h-6 w-32 bg-slate-100" />
              </div>
              <Skeleton className="h-4 w-20 bg-slate-50" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-6 p-4">
                  <Skeleton className="size-20 rounded-2xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2 bg-slate-100" />
                    <Skeleton className="h-3 w-1/4 bg-slate-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Wing */}
        <div className="lg:col-span-4 space-y-16">
          {/* Inquiries */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-lg bg-slate-100" />
                <Skeleton className="h-5 w-24 bg-slate-100" />
              </div>
              <Skeleton className="size-6 rounded-full bg-slate-50" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="size-12 rounded-2xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2 bg-slate-100" />
                    <Skeleton className="h-3 w-3/4 bg-slate-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Insights Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 space-y-6">
            <Skeleton className="h-4 w-32 bg-slate-800" />
            <Skeleton className="h-16 w-full bg-slate-800" />
            <Skeleton className="h-12 w-full bg-slate-800 rounded-xl" />
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <Skeleton className="h-10 w-full bg-slate-800" />
              <Skeleton className="h-10 w-full bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
