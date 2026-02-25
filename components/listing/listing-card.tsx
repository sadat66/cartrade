import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Heart, Info } from "lucide-react";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80";

type ListingCardProps = {
  listing: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number | null;
    price: unknown;
    imageUrls: string[];
    isDepositTaken?: boolean;
    transmission?: string;
    weeklyEstimate?: number;
    interestRate?: number;
  };
  kmLabel?: string;
};

export function ListingCard({ listing, kmLabel = "km" }: ListingCardProps) {
  const price = typeof listing.price === "number" ? listing.price : Number(listing.price);
  
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Absolute Badge */}
      {listing.isDepositTaken && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-slate-400/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          DEPOSIT TAKEN
        </div>
      )}

      {/* Favorite Button */}
      <button className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 text-slate-600 transition-colors hover:bg-white hover:text-red-500 shadow-sm">
        <Heart className="size-4" />
      </button>

      {/* Image Section */}
      <Link href={`/cars/${listing.id}`} className="block relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100">
        <Image
          src={listing.imageUrls[0] || PLACEHOLDER_IMAGE}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/cars/${listing.id}`}>
          <h3 className="text-sm font-bold uppercase tracking-tight text-slate-800">
            {listing.year} {listing.make} {listing.model}
          </h3>
        </Link>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
          {listing.title.split('-')[1]?.trim() || "VARIENT (FWD)"}
        </p>
        
        <div className="mt-2 text-[12px] font-medium text-slate-400">
          {listing.mileage?.toLocaleString() || "0"} {kmLabel} <span className="mx-1">•</span> {listing.transmission || "Automatic"}
        </div>

        <div className="mt-4">
          <div className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            ${price.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-slate-500">
            est. ${listing.weeklyEstimate || Math.round(price / 200)}/wk based on {listing.interestRate || "10.02"}% p.a.
            <Info className="size-3 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Skeleton className="relative aspect-[4/3] w-full shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col p-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
        <Skeleton className="h-4 w-2/3 rounded" />
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}
