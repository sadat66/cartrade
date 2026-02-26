import { Skeleton } from "@/components/ui/skeleton";

export default function MessageChatLoading() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative animate-in fade-in-0 duration-300">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white/95 p-4 px-6 backdrop-blur-md shadow-sm z-10 shrink-0">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-sm bg-slate-50">
          <Skeleton className="size-full" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5 flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <Skeleton className="h-12 w-16 rounded-lg shrink-0" />
        </div>
      </div>

      {/* Messages Scroll Area Skeleton */}
      <div className="flex-1 overflow-hidden p-4 md:p-6 space-y-6 flex flex-col justify-end bg-slate-50/50 pb-20">
        <div className="flex w-full justify-start items-end gap-2 px-2 pb-6">
          <Skeleton className="size-8 rounded-full shrink-0" />
          <div className="space-y-2 w-full max-w-[60%]">
            <Skeleton className="h-16 w-full rounded-2xl rounded-bl-sm" />
          </div>
        </div>

        <div className="flex w-full justify-end items-end gap-2 px-2 pb-6">
          <div className="space-y-2 w-full max-w-[50%] flex flex-col items-end">
             <Skeleton className="h-12 w-full rounded-2xl rounded-br-sm" />
          </div>
          <Skeleton className="size-8 rounded-full shrink-0" />
        </div>

         <div className="flex w-full justify-start items-end gap-2 px-2 pb-6">
          <Skeleton className="size-8 rounded-full shrink-0" />
          <div className="space-y-2 w-full max-w-[40%]">
            <Skeleton className="h-20 w-full rounded-2xl rounded-bl-sm" />
          </div>
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="p-4 md:px-6 md:py-5 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_25px_-15px_rgba(0,0,0,0.1)] relative z-20">
        <div className="flex items-end gap-2 w-full max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
