"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SortSelect } from "./sort-select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilterSidebar } from "./filter-sidebar";
import { useTranslations } from "next-intl";

type Props = {
  resultCount: number;
  sort: string;
  makes: any[];
  bodyTypes: any[];
  currentFilters: any;
};

export function CarsControls({ resultCount, sort, makes, bodyTypes, currentFilters }: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const t = useTranslations("cars.controls");

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t("title")} <span className="text-slate-400 font-bold text-xl md:text-2xl ml-2">({t("results", { count: resultCount })})</span>
          </h1>
          <div className="h-1.5 w-24 bg-[#4B0082] rounded-full" />
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <div className="lg:hidden">
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#4B0082]/30 bg-white px-4 text-xs font-black text-[#4B0082] transition-all hover:bg-[#4B0082]/5 active:scale-[0.98] shadow-sm">
                  <span>{t("filters")}</span>
                  <SlidersHorizontal className="size-3.5 opacity-70" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full p-0 overflow-hidden sm:max-w-[425px] rounded-3xl h-[85vh] flex flex-col" showCloseButton={false}>
                <FilterSidebar 
                  makes={makes} 
                  bodyTypes={bodyTypes} 
                  currentFilters={currentFilters} 
                  isMobile 
                  onClose={() => setIsFilterOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <SortSelect defaultValue={sort} />
        </div>
      </div>
    </div>
  );
}
