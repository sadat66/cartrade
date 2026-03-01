import { Skeleton } from "@/components/ui/skeleton";

export default function NewSellLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 py-6 lg:py-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-10">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded" />
            <span className="text-slate-200">/</span>
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Sidebar Skeleton - Desktop Only */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-48 rounded-xl" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Vertical Stepper Skeleton */}
            <div className="space-y-8 pl-2 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-2xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-full" />
                    {i === 1 && <Skeleton className="h-2 w-24 rounded-full opacity-50" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Tip Box & Strength Meter Skeletons */}
            <Skeleton className="h-32 w-full rounded-[2rem]" />
            <Skeleton className="h-40 w-full rounded-[2.5rem]" />
          </div>

          {/* Main Content Area Skeleton */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mobile Stepper - Tablet/Mobile Only */}
            <div className="lg:hidden flex justify-between items-center px-4 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="size-10 rounded-full" />
              ))}
            </div>

            {/* Main Form Card Skeleton */}
            <div className="w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="p-8 md:p-14 space-y-12">
                {/* Step Header Skeleton */}
                <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
                  <Skeleton className="size-14 rounded-2xl" />
                  <div className="space-y-3">
                    <Skeleton className="h-7 w-40 rounded-lg" />
                    <Skeleton className="h-4 w-60 rounded-md" />
                  </div>
                </div>

                {/* Form Fields Skeleton */}
                <div className="space-y-10">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                  </div>
                </div>

                {/* Footer Navigation Skeleton */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-50">
                  <Skeleton className="h-14 w-full sm:w-44 rounded-2xl" />
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="hidden md:flex flex-col items-end gap-2">
                       <Skeleton className="h-3 w-16" />
                       <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-14 w-full sm:w-52 rounded-[1.25rem]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
