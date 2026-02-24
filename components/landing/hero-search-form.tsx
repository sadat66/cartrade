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
}; type HeroSearchFormProps = {
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
    <div className="w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border border-white/40 dark:border-slate-800/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden">
      <Tabs defaultValue="classic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between px-6 pt-6 border-b border-white/20 dark:border-slate-800/20">
          <TabsList className="bg-transparent gap-6 h-auto p-0">
            <TabsTrigger
              value="classic"
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-base font-semibold transition-all flex items-center gap-2"
            >
              <CarFront className="size-4" />
              {t("search")}
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 text-base font-semibold transition-all flex items-center gap-2"
            >
              <Sparkles className="size-4" />
              AI Search
            </TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground mb-3"
            onClick={clearAll}
          >
            <SlidersHorizontal className="size-3 mr-2" />
            {t("clearAll")}
          </Button>
        </div>

        <div className="p-6">
          <TabsContent value="classic" className="mt-0 space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className="pl-9 h-12 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 rounded-xl focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <Select value={make} onValueChange={setMake}>
                <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 rounded-xl">
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
                <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 rounded-xl">
                  <SelectValue placeholder={t("anyModel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("anyModel")}</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 rounded-xl">
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
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("minPrice")}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-28 pl-6 h-10 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t("maxPrice")}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="100,000+"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-32 pl-6 h-10 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 rounded-lg"
                    />
                  </div>
                </div>

                <div className="ml-auto w-full md:w-auto">
                  <Button
                    type="button"
                    onClick={onClassicSearch}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 h-12 rounded-xl text-base font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                  >
                    {t("search")}
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 dark:border-slate-800/20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Browse by Body Type</p>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {BODY_TYPE_KEYS.map((key) => {
                    const isSelected = selectedBody === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedBody(isSelected ? null : key)}
                        className={cn(
                          "group flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300",
                          isSelected
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-105"
                            : "bg-muted/30 hover:bg-muted/50 text-muted-foreground"
                        )}
                      >
                        <div className="relative size-12 overflow-hidden rounded-lg brightness-90 group-hover:brightness-100 transition-all">
                          <Image
                            src={BODY_TYPE_IMAGES[key]}
                            alt=""
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          {t(`bodyTypes.${key}`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <Sparkles className="size-6 text-purple-600 shrink-0" />
                <p className="text-sm text-purple-900 dark:text-purple-200">
                  Search with natural language. Describe your dream car and our AI will find it for you!
                </p>
              </div>

              <div className="relative">
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g. Find me a white Toyota SUV under $40,000 with low mileage and sunroof..."
                  className="w-full min-h-[120px] p-4 bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-purple-500/30 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-600/10 transition-all text-lg resize-none"
                />
                <Button
                  onClick={onAiSearch}
                  disabled={isAiSearching || !aiQuery.trim()}
                  className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 h-11"
                >
                  {isAiSearching ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="size-4 mr-2" />
                  )}
                  {isAiSearching ? "Let me search for you..." : "Ask AI"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Try:</span>
                <button
                  onClick={() => setAiQuery("Luxury sedan with red interior")}
                  className="hover:text-purple-600 transition-colors uppercase font-semibold"
                >
                  "Luxury sedan with red interior"
                </button>
                <span>•</span>
                <button
                  onClick={() => setAiQuery("Reliable family SUV for long trips")}
                  className="hover:text-purple-600 transition-colors uppercase font-semibold"
                >
                  "Reliable family SUV for long trips"
                </button>
                <span>•</span>
                <button
                  onClick={() => setAiQuery("Sports coupe under 50k km")}
                  className="hover:text-purple-600 transition-colors uppercase font-semibold"
                >
                  "Sports coupe under 50k km"
                </button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
