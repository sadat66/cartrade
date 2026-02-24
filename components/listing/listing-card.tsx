import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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
  };
  kmLabel?: string;
};

export function ListingCard({ listing, kmLabel = "km" }: ListingCardProps) {
  const priceNum = (p: unknown) =>
    typeof p === "number" ? p : Number(p);

  return (
    <Link
      href={`/cars/${listing.id}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card",
        "transition-[box-shadow,border-color] duration-150 hover:border-border hover:shadow-md"
      )}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
        <Image
          src={listing.imageUrls[0] ?? PLACEHOLDER_IMAGE}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {listing.make} {listing.model} · {listing.year}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 mt-4">
          <span className="text-lg font-semibold text-foreground">
            ${priceNum(listing.price).toLocaleString()}
          </span>
          {listing.mileage != null && (
            <span className="text-sm text-muted-foreground">
              {listing.mileage.toLocaleString()} {kmLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
