"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Sparkles, CarFront, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { useLocale } from "next-intl";
import { aiSearchAction } from "@/app/actions/ai-search";
import { Loader2 } from "lucide-react";

function getFiltersFromSearchParams(searchParams: URLSearchParams) {
  const get = (key: string) => searchParams.get(key) ?? "";
  return {
    make: get("make") || "any",
    model: get("model"),
    location: get("location"),
    bodyType: get("bodyType") || null,
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    minYear: get("minYear"),
    maxYear: get("maxYear"),
    minMileage: get("minMileage"),
    maxMileage: get("maxMileage"),
  };
}

export function HeroSearchForm({
  selectedBodyType: controlledBody,
  onBodyTypeChange,
}: HeroSearchFormProps = {}) {
  const searchParams = useSearchParams();
  const [internalBody, setInternalBody] = useState<string | null>(() => {
    const body = searchParams.get("bodyType");
    return body && body !== "any" ? body : null;
  });
  const [activeTab, setActiveTab] = useState("classic");
  const [aiQuery, setAiQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);

  const [make, setMake] = useState<string>(() => getFiltersFromSearchParams(searchParams).make);
  const [model, setModel] = useState<string>(() => getFiltersFromSearchParams(searchParams).model);
  const [location, setLocation] = useState<string>(() => getFiltersFromSearchParams(searchParams).location);
  const [minPrice, setMinPrice] = useState<string>(() => getFiltersFromSearchParams(searchParams).minPrice);
  const [maxPrice, setMaxPrice] = useState<string>(() => getFiltersFromSearchParams(searchParams).maxPrice);
  const [minYear, setMinYear] = useState<string>(() => getFiltersFromSearchParams(searchParams).minYear);
  const [maxYear, setMaxYear] = useState<string>(() => getFiltersFromSearchParams(searchParams).maxYear);
  const [minMileage, setMinMileage] = useState<string>(() => getFiltersFromSearchParams(searchParams).minMileage);
  const [maxMileage, setMaxMileage] = useState<string>(() => getFiltersFromSearchParams(searchParams).maxMileage);

  const locale = useLocale();
  const router = useRouter();

  // Keep form in sync with URL (e.g. after search navigation or back/forward)
  useEffect(() => {
    const f = getFiltersFromSearchParams(searchParams);
    setMake(f.make);
    setModel(f.model);
    setLocation(f.location);
    setMinPrice(f.minPrice);
    setMaxPrice(f.maxPrice);
    setMinYear(f.minYear);
    setMaxYear(f.maxYear);
    setMinMileage(f.minMileage);
    setMaxMileage(f.maxMileage);
    if (!onBodyTypeChange) {
      setInternalBody(f.bodyType);
    }
  }, [searchParams, onBodyTypeChange]);

  const selectedBody = onBodyTypeChange ? controlledBody ?? null : internalBody;
  const setSelectedBody = onBodyTypeChange
    ? (t: string | null) => {
        onBodyTypeChange(t);
      }
    : setInternalBody;
  const t = useTranslations("hero");

  const clearAll = () => {
    setSelectedBody(null);
    setAiQuery("");
    setMake("any");
    setModel("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setMinMileage("");
    setMaxMileage("");
  };

  const onAiSearch = async () => {
    if (!aiQuery.trim()) return;
    setIsAiSearching(true);
    try {
      await aiSearchAction(locale, aiQuery);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiSearching(false);
    }
  };

  const onClassicSearch = () => {
    const params = new URLSearchParams();
    if (selectedBody && selectedBody !== "any") params.append("bodyType", selectedBody);
    if (make && make !== "any") params.append("make", make);
    if (model.trim()) params.append("model", model.trim());
    if (location.trim()) params.append("location", location.trim());
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (minYear) params.append("minYear", minYear);
    if (maxYear) params.append("maxYear", maxYear);
    if (minMileage) params.append("minMileage", minMileage);
    if (maxMileage) params.append("maxMileage", maxMileage);

    router.push(`/${locale}/cars?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-sm min-h-[320px]">
      <Tabs defaultValue="classic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b border-border px-6 pt-5 pb-1">
          <TabsList className="h-auto gap-8 rounded-none border-0 bg-transparent p-0">
            <TabsTrigger
              value="classic"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-0 py-4 text-base font-medium text-muted-foreground transition-colors data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <CarFront className="size-5" />
              {t("search")}
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-0 py-4 text-base font-medium text-muted-foreground transition-colors data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Sparkles className="size-5" />
              AI Search
            </TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            className="mb-3 text-muted-foreground hover:text-foreground"
            onClick={clearAll}
          >
            <SlidersHorizontal className="mr-2 size-4" />
            {t("clearAll")}
          </Button>
        </div>

        <div className="min-h-[380px] px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5">
          <TabsContent value="classic" className="mt-0 h-full min-h-[340px] space-y-6">
            {/* Row 1: Model (search), Make, Location – aligned with listing fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("anyModel")}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="h-12 pl-11 text-base"
                  aria-label={t("anyModel")}
                />
              </div>

              <Select value={make} onValueChange={setMake}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t("anyMake")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("anyMake")}</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="ford">Ford</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="mazda">Mazda</SelectItem>
                  <SelectItem value="hyundai">Hyundai</SelectItem>
                  <SelectItem value="nissan">Nissan</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="text"
                placeholder={t("locationPlaceholder")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 text-base"
                aria-label={t("locationPlaceholder")}
              />
            </div>

            {/* Row 2: Price, Year, Mileage ranges – same as create listing */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("minPrice")}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-11 w-24 pl-7 text-base"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("maxPrice")}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="100,000+"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-11 w-28 pl-7 text-base"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("minYear")}</span>
                  <Input
                    type="number"
                    placeholder="e.g. 2018"
                    min={1990}
                    max={2100}
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    className="h-11 w-24 text-base"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("maxYear")}</span>
                  <Input
                    type="number"
                    placeholder="e.g. 2024"
                    min={1990}
                    max={2100}
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    className="h-11 w-24 text-base"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("minMileage")}</span>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    value={minMileage}
                    onChange={(e) => setMinMileage(e.target.value)}
                    className="h-11 w-24 text-base"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("maxMileage")}</span>
                  <Input
                    type="number"
                    placeholder="200000"
                    min={0}
                    value={maxMileage}
                    onChange={(e) => setMaxMileage(e.target.value)}
                    className="h-11 w-24 text-base"
                  />
                </div>
                <Button
                  type="button"
                  onClick={onClassicSearch}
                  className="ml-auto h-11 px-6 text-base font-medium"
                >
                  {t("search")}
                </Button>
              </div>
            </div>

              <div className="border-t border-border pt-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Body type
                </p>
                <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
                  {BODY_TYPE_KEYS.map((key) => {
                    const isSelected = selectedBody === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedBody(isSelected ? null : key)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors duration-150",
                          isSelected
                            ? "border-foreground bg-foreground text-primary-foreground"
                            : "border-border bg-muted/50 text-muted-foreground hover:border-muted-foreground/40 hover:bg-muted"
                        )}
                      >
                        <div className="relative size-12 overflow-hidden rounded-md">
                          <Image
                            src={BODY_TYPE_IMAGES[key]}
                            alt=""
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <span className="text-[11px] font-medium uppercase tracking-tight">
                          {t(`bodyTypes.${key}`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0 h-full min-h-[340px] space-y-5">
            <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-5">
              <Sparkles className="size-6 shrink-0 text-foreground" />
              <p className="text-base text-muted-foreground">
                Search with natural language. Describe your dream car and our AI will find it.
              </p>
            </div>

            <div className="relative">
              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g. White Toyota SUV under $40,000, low mileage, sunroof..."
                className="min-h-[140px] w-full resize-none rounded-lg border border-input bg-background p-5 text-base focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={onAiSearch}
                disabled={isAiSearching || !aiQuery.trim()}
                className="absolute bottom-4 right-4 h-11 px-5 text-base"
              >
                {isAiSearching ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-4" />
                )}
                {isAiSearching ? "Searching…" : "Ask AI"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Try:</span>
              <button
                onClick={() => setAiQuery("Luxury sedan with red interior")}
                className="hover:text-foreground font-medium transition-colors"
              >
                Luxury sedan with red interior
              </button>
              <span>·</span>
              <button
                onClick={() => setAiQuery("Reliable family SUV for long trips")}
                className="hover:text-foreground font-medium transition-colors"
              >
                Family SUV for long trips
              </button>
              <span>·</span>
              <button
                onClick={() => setAiQuery("Sports coupe under 50k km")}
                className="hover:text-foreground font-medium transition-colors"
              >
                Sports coupe under 50k km
              </button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
