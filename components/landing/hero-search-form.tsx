"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useTranslations, useLocale } from "next-intl";
import { aiSearchAction } from "@/app/actions/ai-search";

export function HeroSearchForm() {
  const searchParams = useSearchParams();
  const [aiQuery, setAiQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("model") || "");

  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("hero");

  useEffect(() => {
    setSearchQuery(searchParams.get("model") || "");
  }, [searchParams]);

  const onAiSearch = async () => {
    if (!aiQuery.trim()) return;
    setIsAiSearching(true);
    try {
      await aiSearchAction(locale, aiQuery);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiSearching(false);
    }
  };

  const onSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("model", searchQuery.trim());
    router.push(`/${locale}/cars?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-medium text-foreground">Find your next car</h2>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="gap-2 font-medium bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground rounded-xl px-4 h-10 border border-border/50 transition-colors cursor-pointer">
              <Sparkles className="size-4 text-blue-600" />
              Quick search
              <span className="text-[10px] font-bold uppercase bg-background border border-border text-foreground px-1.5 py-0.5 rounded ml-1">NEW</span>
              <Search className="size-4 ml-1 opacity-50" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl border-border bg-card">
             <DialogHeader>
                <DialogTitle>Quick Search & AI Assistant</DialogTitle>
             </DialogHeader>
             <div className="space-y-5 pt-4">
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
                  className="absolute bottom-4 right-4 h-11 px-5 text-base bg-blue-600 hover:bg-blue-700 text-white"
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
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search make, model, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="h-14 pl-12 text-lg bg-background w-full shadow-none border-border"
          />
        </div>
        <Button 
          onClick={onSearch} 
          className="h-14 px-8 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shrink-0 rounded-lg"
        >
          Search cars
        </Button>
      </div>
    </div>
  );
}
