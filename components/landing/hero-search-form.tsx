"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function HeroSearchForm({
  selectedBodyType: controlledBody,
  onBodyTypeChange,
}: HeroSearchFormProps = {}) {
  const [internalBody, setInternalBody] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("classic");
  const [aiQuery, setAiQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);

  const [make, setMake] = useState<string>("any");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const locale = useLocale();
  const router = useRouter();

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
    setMinPrice("");
    setMaxPrice("");
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
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className="h-12 pl-11 text-base"
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
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t("anyModel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("anyModel")}</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t("allStates")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStates")}</SelectItem>
                  <SelectItem value="nsw">NSW</SelectItem>
                  <SelectItem value="vic">VIC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">{t("minPrice")}</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-11 w-28 pl-7 text-base"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">{t("maxPrice")}</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="100,000+"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-11 w-32 pl-7 text-base"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={onClassicSearch}
                  className="ml-auto h-12 px-8 text-base font-medium"
                >
                  {t("search")}
                </Button>
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
