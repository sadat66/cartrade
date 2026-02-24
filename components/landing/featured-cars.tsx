import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

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

export async function FeaturedCars({
  listings,
  locale,
}: {
  listings: Listing[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "featured" });
  const priceNum = (p: unknown) => (typeof p === "number" ? p : Number(p));

  if (listings.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {t("noListings")}{" "}
          <Link
            href="/dashboard/sell/new"
            className="font-medium text-primary underline"
          >
            {t("listYourCar")}
          </Link>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:px-6">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {t("title")}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {listings.map((car) => (
          <Link
            key={car.id}
            href={`/cars/${car.id}`}
            className={cn(
              "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card",
              "transition-[box-shadow,border-color] duration-150 hover:border-border hover:shadow-md"
            )}
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
              <Image
                src={car.imageUrls[0] ?? PLACEHOLDER_IMAGE}
                alt={car.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary">
                {car.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {car.make} {car.model} · {car.year}
              </p>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 mt-4">
                <span className="text-lg font-semibold text-foreground">
                  ${priceNum(car.price).toLocaleString()}
                </span>
                {car.mileage != null && (
                  <span className="text-sm text-muted-foreground">
                    {car.mileage.toLocaleString()} {t("km")}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
