"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  RotateCcw, 
  Car, 
  DollarSign, 
  Gauge,
  Fuel,
  Settings2,
  Lock,
  Armchair,
  Palette,
  Eye,
  Check,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

// --- Types ---
type CountItem = {
  key: string;
  label: string;
  count: number;
};

type FilterSidebarProps = {
  makes: CountItem[];
  bodyTypes: CountItem[];
  currentFilters: { [key: string]: string | undefined };
  isMobile?: boolean;
  onClose?: () => void;
};

// --- Mock Data ---
const FUEL_TYPES = [
  { key: "petrol", label: "Petrol", count: 12 },
  { key: "diesel", label: "Diesel", count: 8 },
  { key: "electric", label: "Electric", count: 3 },
  { key: "hybrid", label: "Hybrid", count: 5 },
];

const TRANSMISSIONS = [
  { key: "automatic", label: "Automatic", count: 20 },
  { key: "manual", label: "Manual", count: 8 },
];

const DRIVETRAINS = [
  { key: "fwd", label: "FWD", count: 15 },
  { key: "rwd", label: "RWD", count: 5 },
  { key: "awd", label: "AWD", count: 8 },
];

const COLOURS = [
  { key: "white", label: "White", hex: "#FFFFFF", count: 10 },
  { key: "black", label: "Black", hex: "#000000", count: 8 },
  { key: "silver", label: "Silver", hex: "#C0C0C0", count: 5 },
  { key: "blue", label: "Blue", hex: "#0000FF", count: 3 },
  { key: "red", label: "Red", hex: "#FF0000", count: 2 },
];

// --- Sub-components ---

function FilterSection({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3.5">
          <div className="size-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#4B0082]/10 group-hover:text-[#4B0082] group-hover:border-[#4B0082]/20 transition-all">
            <Icon className="size-4.5" />
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight">{title}</span>
        </div>
        <div className={cn(
          "size-6 rounded-full flex items-center justify-center transition-transform duration-300",
          isOpen ? "rotate-180 bg-slate-100" : "bg-transparent"
        )}>
          <ChevronDown className="size-3.5 text-slate-400" />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({ makes, bodyTypes, currentFilters, isMobile, onClose }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openSections, setOpenSections] = useState<string[]>(["make", "price"]);
  const [makeSearch, setMakeSearch] = useState("");

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push("/cars", { scroll: false });
  };

  const filteredMakes = makes.filter(m => 
    m.label.toLowerCase().includes(makeSearch.toLowerCase())
  );

  return (
    <div className={cn(
      "bg-white flex flex-col transition-all",
      isMobile ? "h-full w-full" : "rounded-2xl border border-slate-200 shadow-xl overflow-hidden lg:h-[calc(100vh-200px)]"
    )}>
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {isMobile && (
            <button onClick={onClose} className="mr-2 p-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors">
              <X className="size-5" />
            </button>
          )}
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Filters</h2>
        </div>
        <button 
          onClick={clearFilters}
          className="text-xs font-black text-[#4B0082] hover:underline flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="size-3.5" />
          CLEAR ALL
        </button>
      </div>

      {/* Filter Content */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        
        {/* Make & Model */}
        <FilterSection 
          title="Make & Model" 
          icon={Car} 
          isOpen={openSections.includes("make")} 
          onToggle={() => toggleSection("make")}
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <Input 
              placeholder="Search make..."
              value={makeSearch}
              onChange={(e) => setMakeSearch(e.target.value)}
              className="pl-11 h-10 border-slate-200 rounded-xl focus:ring-[#4B0082]/20 focus:border-[#4B0082] bg-slate-50/50 text-sm"
            />
          </div>
          <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredMakes.map((make) => (
              <label 
                key={make.key} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all",
                  currentFilters.make === make.key ? "bg-[#4B0082]/5" : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      checked={currentFilters.make?.toLowerCase() === make.key.toLowerCase()}
                      onChange={() => handleFilterChange("make", currentFilters.make === make.key ? null : make.key)}
                      className="peer size-5 rounded-lg border-slate-300 text-[#4B0082] focus:ring-[#4B0082]/20 cursor-pointer appearance-none border-2 checked:bg-[#4B0082] checked:border-[#4B0082] transition-all"
                    />
                    <Check className="absolute left-1 size-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className={cn(
                    "text-sm font-bold tracking-tight transition-colors",
                    currentFilters.make === make.key ? "text-[#4B0082]" : "text-slate-600"
                  )}>
                    {make.label}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {make.count}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection 
          title="Price Range" 
          icon={DollarSign} 
          isOpen={openSections.includes("price")} 
          onToggle={() => toggleSection("price")}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Price</span>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <Input 
                  type="number"
                  placeholder="0"
                  value={currentFilters.minPrice || ""}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="pl-8 h-10 border-slate-200 rounded-xl focus:ring-[#4B0082]/20 font-bold text-slate-700 bg-slate-50/50 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Price</span>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <Input 
                  type="number"
                  placeholder="Any"
                  value={currentFilters.maxPrice || ""}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="pl-8 h-10 border-slate-200 rounded-xl focus:ring-[#4B0082]/20 font-bold text-slate-700 bg-slate-50/50 text-sm"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Kilometers */}
        <FilterSection 
          title="Kilometers" 
          icon={Gauge} 
          isOpen={openSections.includes("km")} 
          onToggle={() => toggleSection("km")}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min KM</span>
              <Input 
                type="number"
                placeholder="0"
                value={currentFilters.minMileage || ""}
                onChange={(e) => handleFilterChange("minMileage", e.target.value)}
                className="h-10 border-slate-200 rounded-xl focus:ring-[#4B0082]/20 font-bold text-slate-700 bg-slate-50/50 px-4 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max KM</span>
              <Input 
                type="number"
                placeholder="Any"
                value={currentFilters.maxMileage || ""}
                onChange={(e) => handleFilterChange("maxMileage", e.target.value)}
                className="h-10 border-slate-200 rounded-xl focus:ring-[#4B0082]/20 font-bold text-slate-700 bg-slate-50/50 px-4 text-sm"
              />
            </div>
          </div>
        </FilterSection>

        {/* Fuel Type */}
        <FilterSection 
          title="Fuel type" 
          icon={Fuel} 
          isOpen={openSections.includes("fuel")} 
          onToggle={() => toggleSection("fuel")}
        >
          <div className="grid grid-cols-1 gap-2.5">
            {FUEL_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => handleFilterChange("fuelType", currentFilters.fuelType === type.key ? null : type.key)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2",
                  currentFilters.fuelType === type.key 
                    ? "bg-[#4B0082] border-[#4B0082] text-white shadow-md shadow-[#4B0082]/20" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                )}
              >
                <span>{type.label}</span>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  currentFilters.fuelType === type.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                )}>{type.count}</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Transmission */}
        <FilterSection 
          title="Transmission" 
          icon={Settings2} 
          isOpen={openSections.includes("trans")} 
          onToggle={() => toggleSection("trans")}
        >
          <div className="grid grid-cols-2 gap-2.5">
            {TRANSMISSIONS.map((type) => (
              <button
                key={type.key}
                onClick={() => handleFilterChange("transmission", currentFilters.transmission === type.key ? null : type.key)}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-black transition-all border-2",
                  currentFilters.transmission === type.key 
                    ? "bg-[#4B0082] border-[#4B0082] text-white" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Drivetrain */}
        <FilterSection 
          title="Drivetrain" 
          icon={Lock} 
          isOpen={openSections.includes("drive")} 
          onToggle={() => toggleSection("drive")}
        >
          <div className="flex flex-wrap gap-2">
            {DRIVETRAINS.map((type) => (
              <button
                key={type.key}
                onClick={() => handleFilterChange("drivetrain", currentFilters.drivetrain === type.key ? null : type.key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-black border-2 transition-all",
                  currentFilters.drivetrain === type.key 
                    ? "bg-[#4B0082]/10 border-[#4B0082] text-[#4B0082]" 
                    : "bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Colour */}
        <FilterSection 
          title="Colour" 
          icon={Palette} 
          isOpen={openSections.includes("colour")} 
          onToggle={() => toggleSection("colour")}
        >
          <div className="flex flex-wrap gap-3">
            {COLOURS.map((c) => (
              <button
                key={c.key}
                title={c.label}
                onClick={() => handleFilterChange("colour", currentFilters.colour === c.key ? null : c.key)}
                className={cn(
                  "size-8 rounded-xl border-2 transition-all flex items-center justify-center relative shadow-sm",
                  currentFilters.colour === c.key ? "border-[#4B0082] ring-4 ring-[#4B0082]/10 scale-110" : "border-slate-200 hover:border-slate-300"
                )}
                style={{ backgroundColor: c.hex }}
              >
                {currentFilters.colour === c.key && (
                  <Check className={cn("size-4", c.key === "white" ? "text-slate-900" : "text-white")} />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Toggle Option */}
        <div className="p-5 mt-2 border-t border-slate-100">
           <button 
             onClick={() => handleFilterChange("available", currentFilters.available === "true" ? null : "true")}
             className={cn(
               "w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all group",
               currentFilters.available === "true" 
                 ? "bg-[#4B0082]/5 border-[#4B0082] shadow-sm" 
                 : "bg-slate-50/50 border-transparent hover:border-slate-200"
             )}
           >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "size-8 rounded-xl flex items-center justify-center transition-all",
                  currentFilters.available === "true" ? "bg-[#4B0082] text-white" : "bg-white text-slate-500 shadow-sm border border-slate-100"
                )}>
                  <Eye className="size-4" />
                </div>
                <div className="text-left">
                  <p className={cn("text-[13px] font-black tracking-tight", currentFilters.available === "true" ? "text-[#4B0082]" : "text-slate-800")}>
                    Available Only
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Hide sold cars
                  </p>
                </div>
              </div>
              <div className={cn(
                "relative h-6 w-11 rounded-full p-1 transition-colors",
                currentFilters.available === "true" ? "bg-[#4B0082]" : "bg-slate-300"
              )}>
                <div className={cn(
                   "size-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                   currentFilters.available === "true" ? "translate-x-5" : "translate-x-0"
                )} />
              </div>
           </button>
        </div>
      </div>

      {/* Mobile Actions */}
      {isMobile && (
        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <button 
            onClick={clearFilters}
            className="h-11 rounded-xl border border-slate-200 font-bold text-slate-600 active:scale-95 transition-all text-sm"
          >
            Reset
          </button>
          <button 
            onClick={onClose}
            className="h-11 rounded-xl bg-[#4B0082] text-white font-black active:scale-95 transition-all shadow-md shadow-[#4B0082]/10 text-sm"
          >
            Show results
          </button>
        </div>
      )}
    </div>
  );
}
