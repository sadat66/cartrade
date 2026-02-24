"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteListingButton } from "@/components/listing/delete-listing-button";
import { cn } from "@/lib/utils";
import { Car, ExternalLink } from "lucide-react";

type Listing = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrls: string[];
};

type Props = {
  listings: Listing[];
  noImageLabel: string;
  addListingHref: string;
  addListingLabel: string;
  createFirstLabel: string;
};

export function MyListingsGrid({
  listings,
  noImageLabel,
  addListingHref,
  addListingLabel,
  createFirstLabel,
}: Props) {
  if (listings.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center",
          "animate-in fade-in-0 duration-300 fill-mode-both"
        )}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Car className="size-8" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">No listings yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {createFirstLabel}{" "}
          <Link
            href={addListingHref}
            className="font-medium text-primary underline underline-offset-2 transition-colors hover:no-underline"
          >
            {addListingLabel}
          </Link>
          .
        </p>
        <Link
          href={addListingHref}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
        >
          {addListingLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((listing, index) => (
        <Card
          key={listing.id}
          className={cn(
            "overflow-hidden transition-all duration-200 hover:shadow-md",
            "animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both"
          )}
          style={{ animationDelay: `${Math.min(index * 50, 300)}ms`, animationDuration: "300ms" }}
        >
          <CardContent className="p-0">
            <div className="flex gap-3 p-3">
              <Link
                href={`/cars/${listing.id}`}
                className="flex min-w-0 flex-1 gap-3 transition-opacity hover:opacity-90"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {listing.imageUrls[0] ? (
                    <Image
                      src={listing.imageUrls[0]}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-200 hover:scale-105"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                      {noImageLabel}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{listing.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {listing.make} {listing.model} · {listing.year}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    ${listing.price.toLocaleString()}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                    View <ExternalLink className="size-3" />
                  </span>
                </div>
              </Link>
              <DeleteListingButton listingId={listing.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
