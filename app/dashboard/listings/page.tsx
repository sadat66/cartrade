import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function MyListingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My listings</h1>
          <p className="text-muted-foreground">
            {listings.length} {listings.length === 1 ? "listing" : "listings"}
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/listings/new">Add listing</Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t listed any cars yet.{" "}
          <Link
            href="/dashboard/listings/new"
            className="font-medium text-primary underline"
          >
            Create your first listing
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/cars/${listing.id}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3] bg-muted">
                  {listing.imageUrls[0] ? (
                    <Image
                      src={listing.imageUrls[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <span className="absolute right-2 top-2 rounded bg-background/80 px-2 py-0.5 text-xs font-medium">
                    {listing.status}
                  </span>
                </div>
                <CardContent className="p-4">
                  <p className="font-semibold">{listing.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {listing.make} {listing.model} · {listing.year}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <span className="font-bold">
                    ${Number(listing.price).toLocaleString()}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
