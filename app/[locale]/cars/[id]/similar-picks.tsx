"use client";

import { CardCarousel } from "@/components/shared/card-carousel";
import { ListingCard } from "@/components/listing/listing-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

type SimilarListing = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: unknown;
  imageUrls: string[];
  isDepositTaken?: boolean;
  transmission?: string | null;
  drivetrain?: string | null;
};

interface SimilarPicksProps {
  title: string;
  listings: SimilarListing[];
}

export function SimilarPicks({ title, listings }: SimilarPicksProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: { canScrollPrev: () => boolean; canScrollNext: () => boolean }) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (listings.length === 0) return null;

  return (
    <section className="w-full mt-12 lg:mt-16">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="size-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="size-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 -ml-4">
          {listings.map((listing) => {
            const price = Number(listing.price);
            return (
              <div
                key={listing.id}
                className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_23.5%] min-w-0 pl-4"
              >
                <ListingCard
                  listing={{
                    ...listing,
                    weeklyEstimate: Math.round(price / 200),
                    interestRate: 10.02,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
