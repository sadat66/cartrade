"use client";

import React, { useState, useMemo } from "react";
import { Hero } from "@/components/landing/hero";
import { BodyTypeFilter } from "@/components/landing/body-type-filter";
import { FeaturedCars } from "@/components/landing/featured-cars";
import { BudgetSection } from "@/components/landing/budget-section";
import { NewCarsSection } from "@/components/landing/new-cars-section";
import { Footer } from "@/components/landing/footer-client";

type Listing = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  imageUrls: string[];
  bodyType: string | null;
};

export default function HomeClient({ 
  initialListings, 
  locale 
}: { 
  initialListings: Listing[];
  locale: any;
}) {
  const [activeBodyType, setActiveBodyType] = useState("suv");

  const filteredListings = useMemo(() => {
    return initialListings.filter(
      l => l.bodyType?.toLowerCase() === activeBodyType.toLowerCase()
    );
  }, [initialListings, activeBodyType]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 relative">
        <Hero />
        <section className="pt-16 md:pt-20">
          <BodyTypeFilter 
            activeBodyType={activeBodyType} 
            onBodyTypeChange={setActiveBodyType} 
          />
          <FeaturedCars 
            listings={filteredListings} 
            locale={locale} 
            activeBodyType={activeBodyType}
          />
          <BudgetSection listings={initialListings} />
          <NewCarsSection listings={initialListings.slice(0, 10)} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
