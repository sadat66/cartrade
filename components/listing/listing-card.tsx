import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80";

type ListingCardProps = {
    listing: {
        id: string;
        title: string;
        make: string;
        model: string;
        year: number;
        mileage: number | null;
        price: any;
        imageUrls: string[];
    };
    kmLabel?: string;
};

export function ListingCard({ listing, kmLabel = "km" }: ListingCardProps) {
    const priceNum = (p: any) => (typeof p === "number" ? p : Number(p));

    return (
        <Link href={`/cars/${listing.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-xl group h-full flex flex-col border-white/20 dark:border-slate-800/20 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                        src={listing.imageUrls[0] ?? PLACEHOLDER_IMAGE}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardContent className="flex-1 p-5">
                    <h3 className="font-bold text-lg leading-snug group-hover:text-blue-600 transition-colors">{listing.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm font-medium">
                        <span className="px-2 py-0.5 bg-muted rounded-md">{listing.year}</span>
                        <span>·</span>
                        <span>{listing.make} {listing.model}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-5 pt-0 border-t border-white/10 dark:border-slate-800/10">
                    <span className="text-xl font-black text-blue-600">
                        ${priceNum(listing.price).toLocaleString()}
                    </span>
                    {listing.mileage != null && (
                        <span className="text-muted-foreground text-sm font-semibold">
                            {listing.mileage.toLocaleString()} {kmLabel}
                        </span>
                    )}
                </CardFooter>
            </Card>
        </Link>
    );
}
