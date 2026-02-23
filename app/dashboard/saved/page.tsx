import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default async function SavedListingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const saved = await prisma.savedListing.findMany({
    where: { userId: user.id },
    include: {
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved listings</h1>
        <p className="text-muted-foreground">
          {saved.length} {saved.length === 1 ? "car" : "cars"} saved
        </p>
      </div>

      {saved.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t saved any listings yet. Browse{" "}
          <Link href="/" className="font-medium text-primary underline">
            featured cars
          </Link>{" "}
          and click the heart to save.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map(({ listing }) => (
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
                  <span className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5">
                    <Heart className="size-4 fill-red-500 text-red-500" />
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
