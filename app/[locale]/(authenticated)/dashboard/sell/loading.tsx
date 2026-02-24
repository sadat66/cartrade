import { Skeleton } from "@/components/ui/skeleton";

export default function SellLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-40 md:h-9 md:w-52" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-32 shrink-0" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[104px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
