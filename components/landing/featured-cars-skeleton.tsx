import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedCarsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-6">
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card
            key={i}
            className="h-full flex flex-col overflow-hidden"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <CardContent className="flex-1 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4 pt-0">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
