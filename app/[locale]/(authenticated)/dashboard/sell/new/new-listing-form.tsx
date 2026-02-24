"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createListing } from "@/app/actions/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/listing/location-picker";
import { SubmitButton } from "@/components/ui/submit-button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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

function FormLoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-[2px]",
        "animate-in fade-in-0 duration-150"
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Creating listing…</p>
      </div>
    </div>
  );
}

export function NewListingForm() {
  const router = useRouter();
  const t = useTranslations("common.toast");
  const tHero = useTranslations("hero");
  const [bodyType, setBodyType] = useState<string>("");
  const [state, formAction] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => {
      const result = await createListing(formData);
      if (result.error) {
        toast.error(t("error"));
        return { error: result.error };
      }
      if (result.listingId) {
        toast.success(t("listingCreated"));
        router.push("/cars/" + result.listingId);
      }
      return {};
    },
    {}
  );

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <CardContent className="relative pt-6">
        <form action={formAction} className="relative space-y-5">
          <FormLoadingOverlay />
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Toyota Camry 2022"
              className="mt-1"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="make" className="text-sm font-medium">
                Make
              </label>
              <Input id="make" name="make" placeholder="Toyota" className="mt-1" required />
            </div>
            <div>
              <label htmlFor="model" className="text-sm font-medium">
                Model
              </label>
              <Input id="model" name="model" placeholder="Camry" className="mt-1" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="year" className="text-sm font-medium">
                Year
              </label>
              <Input
                id="year"
                name="year"
                type="number"
                min={1900}
                max={2100}
                placeholder="2022"
                className="mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="mileage" className="text-sm font-medium">
                Mileage (km)
              </label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                min={0}
                placeholder="50000"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor="price" className="text-sm font-medium">
              Price ($)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step={0.01}
              placeholder="28990"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="bodyType" className="text-sm font-medium">
              Body type
            </label>
            <Select value={bodyType || "none"} onValueChange={(v) => setBodyType(v === "none" ? "" : v)}>
              <SelectTrigger id="bodyType" className={cn("mt-1", !bodyType && "text-muted-foreground")}>
                <SelectValue placeholder={tHero("anyBodyType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{tHero("anyBodyType")}</SelectItem>
                {BODY_TYPE_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {tHero(`bodyTypes.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="bodyType" value={bodyType} />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Condition, features, reason for selling..."
              className="border-input mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <LocationPicker mapHeight="260px" />
          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}
          <SubmitButton
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            loadingText={t("creating")}
          >
            Create listing
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
