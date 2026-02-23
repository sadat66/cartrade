"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Ute",
  "Hatch",
  "Coupe",
  "Sports",
  "Performance",
  "Unique",
] as const;

const BODY_TYPE_IMAGES: Record<(typeof BODY_TYPES)[number], string> = {
  Sedan: "/herocar/hero1.png",
  SUV: "/herocar/hero2.png",
  Ute: "/herocar/hero3.png",
  Hatch: "/herocar/hero4.png",
  Coupe: "/herocar/hero5.png",
  Sports: "/herocar/hero6.png",
  Performance: "/herocar/hero7.png",
  Unique: "/herocar/hero1.png",
};

type HeroSearchFormProps = {
  selectedBodyType?: string | null;
  onBodyTypeChange?: (type: string | null) => void;
};

export function HeroSearchForm({
  selectedBodyType: controlledBody,
  onBodyTypeChange,
}: HeroSearchFormProps = {}) {
  const [internalBody, setInternalBody] = useState<string | null>(null);
  const selectedBody = onBodyTypeChange ? controlledBody ?? null : internalBody;
  const setSelectedBody = onBodyTypeChange
    ? (t: string | null) => {
        onBodyTypeChange(t);
      }
    : setInternalBody;

  const clearAll = () => {
    setSelectedBody(null);
    // Form reset would go here if using controlled inputs
  };

  return (
    <div className="w-full max-w-7xl rounded-2xl border border-white/20 bg-white p-3 shadow-2xl sm:p-4">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Find your next car"
            className="pl-8 h-9 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Any Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Make</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="ford">Ford</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Any Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Model</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Any body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any body type</SelectItem>
              {BODY_TYPES.map((t) => (
                <SelectItem key={t} value={t.toLowerCase()}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="nsw">NSW</SelectItem>
              <SelectItem value="vic">VIC</SelectItem>
              <SelectItem value="qld">QLD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">Min price</span>
            <Input type="number" placeholder="$0" className="w-20 h-8 text-sm" />
          </div>
          <span className="text-muted-foreground text-sm">–</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">Max price</span>
            <Input
              type="number"
              placeholder="$1,000,000+"
              className="w-24 h-8 text-sm"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground ml-1 text-xs h-8 px-2"
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-1">
          {BODY_TYPES.map((type) => {
            const isSelected = selectedBody === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setSelectedBody(isSelected ? null : type)
                }
                className={cn(
                  "flex shrink-0 flex-col items-center gap-1 rounded-lg border-2 p-1.5 w-24 sm:w-28 transition-all hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-muted/50"
                )}
                aria-label={type}
              >
                <div className="relative h-12 w-20 sm:h-14 sm:w-24 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={BODY_TYPE_IMAGES[type]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {type}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-0">
          <Button
            type="submit"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-8"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
