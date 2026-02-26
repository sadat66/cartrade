import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLayoutLoading() {
  return (
    <div className="min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col py-6 pt-8 lg:pt-14 pb-10">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6 shrink-0">
          <Skeleton className="h-3 w-12 rounded" />
          <div className="size-3 flex items-center justify-center">
            <div className="size-1 bg-slate-200 rounded-full" />
          </div>
          <Skeleton className="h-3 w-16 rounded" />
        </div>

        {/* Layout Container Skeleton */}
        <div className="flex flex-1 h-full min-h-[600px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-200/50">
          
          {/* Sidebar Skeleton */}
          <div className="flex w-full flex-col border-r border-slate-200 bg-slate-50/50 md:w-80 lg:w-96 shrink-0 relative">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-white shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)] z-10 shrink-0">
              <Skeleton className="h-6 w-32 rounded-lg" />
            </div>
            
            <div className="flex-1 overflow-y-auto w-full">
              <ul className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 bg-white">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-3 w-12 rounded" />
                      </div>
                      <Skeleton className="h-3 w-32 rounded" />
                      <Skeleton className="h-3 w-48 rounded" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Chat Area Skeleton */}
          <div className="hidden md:flex flex-1 flex-col bg-slate-50/30 overflow-hidden relative">
            <div className="flex h-full items-center justify-center fade-in-0 duration-300 animate-in">
              <div className="text-center space-y-6 flex flex-col items-center">
                <Skeleton className="size-20 rounded-full bg-slate-200" />
                <div className="space-y-2 flex flex-col items-center">
                  <Skeleton className="h-6 w-64 rounded-xl" />
                  <Skeleton className="h-4 w-48 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
