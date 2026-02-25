"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  status: string;
  mileage: number | null;
  bodyType: string | null;
  location: string | null;
  createdAt: string;
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
    <div className="rounded-md border animate-in fade-in-0 duration-300">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[120px]">Image</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Specifics</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="text-sm text-slate-500 font-medium">
                {new Date(listing.createdAt).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-muted border border-slate-100 shadow-sm">
                  {listing.imageUrls[0] ? (
                    <Image
                      src={listing.imageUrls[0]}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform hover:scale-110"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-1 text-[10px] text-muted-foreground text-center bg-slate-50">
                      {noImageLabel}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/cars/${listing.id}`}
                    className="font-bold hover:text-[#ff385c] text-foreground transition-colors truncate max-w-[200px]"
                    title={listing.title}
                  >
                    {listing.title}
                  </Link>
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">{listing.year}</span>
                    <span>•</span>
                    <span>{listing.make} {listing.model}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  {listing.mileage != null && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-16 font-medium text-slate-400">Mileage:</span>
                      <span className="text-slate-700 font-semibold">{listing.mileage.toLocaleString()} km</span>
                    </span>
                  )}
                  {listing.bodyType && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-16 font-medium text-slate-400">Body:</span>
                      <span className="text-slate-700 font-semibold">{listing.bodyType}</span>
                    </span>
                  )}
                  {listing.location && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-16 font-medium text-slate-400">Location:</span>
                      <span className="text-slate-700 font-semibold truncate max-w-[120px]" title={listing.location}>{listing.location}</span>
                    </span>
                  )}
                  {!listing.mileage && !listing.bodyType && !listing.location && (
                    <span className="italic text-slate-400">No specifics</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                  listing.status === "active" ? "bg-green-100 text-green-700 ring-1 ring-green-600/20" :
                    listing.status === "sold" ? "bg-slate-100 text-slate-700 ring-1 ring-slate-600/20" :
                      listing.status === "draft" ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20" : "bg-slate-100 text-slate-700"
                )}>
                  {listing.status}
                </span>
              </TableCell>
              <TableCell className="font-extrabold text-slate-900 border-l border-slate-50">
                ${listing.price.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-4">
                  <Link
                    href={`/cars/${listing.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#ff385c] transition-colors uppercase tracking-wider bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    View <ExternalLink className="size-3" />
                  </Link>
                  <DeleteListingButton listingId={listing.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
