import { Skeleton } from "@/components/ui/skeleton";

export default function NewListingLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-20 w-full" />
      </div>
      <Skeleton className="h-[520px] w-full rounded-xl" />
    </div>
  );
}
