import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80";

type Listing = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: unknown;
  imageUrls: string[];
};

export async function FeaturedCars({ listings }: { listings: Listing[] }) {
  const t = await getTranslations("featured");
  const priceNum = (p: unknown) => (typeof p === "number" ? p : Number(p));

  if (listings.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {t("noListings")}{" "}
          <Link href="/dashboard/listings/new" className="font-medium text-primary underline">
            {t("listYourCar")}
          </Link>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:px-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
        {t("title")}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {listings.map((car) => (
          <Link key={car.id} href={`/cars/${car.id}`}>
            <Card
              className={cn(
                "overflow-hidden transition-shadow hover:shadow-md",
                "h-full flex flex-col"
              )}
            >
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={car.imageUrls[0] ?? PLACEHOLDER_IMAGE}
                  alt={car.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
              </div>
              <CardContent className="flex-1 p-4">
                <p className="font-semibold">{car.title}</p>
                <p className="text-muted-foreground text-sm">
                  {car.make} {car.model} · {car.year}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4 pt-0">
                <span className="text-lg font-bold">
                  ${priceNum(car.price).toLocaleString()}
                </span>
                {car.mileage != null && (
                  <span className="text-muted-foreground text-sm">
                    {car.mileage.toLocaleString()} {t("km")}
                  </span>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
