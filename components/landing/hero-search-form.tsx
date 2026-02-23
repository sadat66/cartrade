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
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const BODY_TYPE_KEYS = [
  "sedan",
  "suv",
  "ute",
  "hatch",
  "coupe",
  "sports",
  "performance",
  "unique",
] as const;

const BODY_TYPE_IMAGES: Record<(typeof BODY_TYPE_KEYS)[number], string> = {
  sedan: "/herocar/hero1.png",
  suv: "/herocar/hero2.png",
  ute: "/herocar/hero3.png",
  hatch: "/herocar/hero4.png",
  coupe: "/herocar/hero5.png",
  sports: "/herocar/hero6.png",
  performance: "/herocar/hero7.png",
  unique: "/herocar/hero1.png",
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
  const t = useTranslations("hero");

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
            placeholder={t("searchPlaceholder")}
            className="pl-8 h-9 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder={t("anyMake")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("anyMake")}</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="ford">Ford</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder={t("anyModel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("anyModel")}</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder={t("anyBodyType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("anyBodyType")}</SelectItem>
              {BODY_TYPE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {t(`bodyTypes.${key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder={t("allStates")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStates")}</SelectItem>
              <SelectItem value="nsw">NSW</SelectItem>
              <SelectItem value="vic">VIC</SelectItem>
              <SelectItem value="qld">QLD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">{t("minPrice")}</span>
            <Input type="number" placeholder="$0" className="w-20 h-8 text-sm" />
          </div>
          <span className="text-muted-foreground text-sm">–</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">{t("maxPrice")}</span>
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
            {t("clearAll")}
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-1">
          {BODY_TYPE_KEYS.map((key) => {
            const isSelected = selectedBody === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setSelectedBody(isSelected ? null : key)
                }
                className={cn(
                  "flex shrink-0 flex-col items-center gap-1 rounded-lg border-2 p-1.5 w-24 sm:w-28 transition-all hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-muted/50"
                )}
                aria-label={t(`bodyTypes.${key}`)}
              >
                <div className="relative h-12 w-20 sm:h-14 sm:w-24 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={BODY_TYPE_IMAGES[key]}
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
                  {t(`bodyTypes.${key}`)}
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
            {t("search")}
          </Button>
        </div>
      </div>
    </div>
  );
}
