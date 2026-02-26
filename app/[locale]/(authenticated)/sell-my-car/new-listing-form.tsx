"use client";

import { useActionState, useState, useCallback } from "react";
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
import { Loader2, ImagePlus, X } from "lucide-react";

const MAX_PHOTOS = 3;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_SINGLE_BYTES = Math.floor(3.3 * 1024 * 1024); // ~3.3MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

const TRANSMISSION_KEYS = ["automatic", "manual"] as const;
const DRIVETRAIN_KEYS = ["fwd", "rwd", "awd", "4wd"] as const;
const COLOR_KEYS = ["white", "black", "silver", "blue", "red"] as const;

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
  const tc = useTranslations("cars");
  const [bodyType, setBodyType] = useState<string>("");
  const [transmission, setTransmission] = useState<string>("");
  const [drivetrain, setDrivetrain] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null]);
  const [clearPhotoKeys, setClearPhotoKeys] = useState([0, 0, 0]);
  const [photoSizes, setPhotoSizes] = useState<number[]>([0, 0, 0]);

  const removePhoto = useCallback((index: number) => {
    setPreviewUrls((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!);
      next[index] = null;
      return next;
    });
    setPhotoSizes((prev) => {
      const next = [...prev];
      next[index] = 0;
      return next;
    });
    setClearPhotoKeys((prev) => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
  }, []);

  const onPhotoChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) {
        removePhoto(index);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error("Only JPEG, PNG and WebP are allowed");
        e.target.value = "";
        return;
      }
      if (file.size > MAX_SINGLE_BYTES) {
        toast.error("Each photo must be 3.3MB or less");
        e.target.value = "";
        return;
      }
      setPreviewUrls((prev) => {
        const next = [...prev];
        if (next[index]) URL.revokeObjectURL(next[index]!);
        next[index] = URL.createObjectURL(file);
        return next;
      });
      setPhotoSizes((prev) => {
        const next = [...prev];
        next[index] = file.size;
        return next;
      });
    },
    [removePhoto]
  );

  const totalPhotoBytes = photoSizes.reduce((a, b) => a + b, 0);
  const totalPhotoOk = totalPhotoBytes <= MAX_TOTAL_BYTES;

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
        <form
          action={formAction}
          className="relative space-y-5"
          onSubmit={(e) => {
            if (!totalPhotoOk && totalPhotoBytes > 0) {
              e.preventDefault();
              toast.error("Total photo size must be 10MB or less");
            }
          }}
        >
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="transmission" className="text-sm font-medium">
                {tc("filters.transmission")}
              </label>
              <Select value={transmission || "none"} onValueChange={(v) => setTransmission(v === "none" ? "" : v)}>
                <SelectTrigger id="transmission" className={cn("mt-1", !transmission && "text-muted-foreground")}>
                  <SelectValue placeholder={tc("filters.transmission")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{tc("filters.transmission")}</SelectItem>
                  {TRANSMISSION_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {tc(`transmissions.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="transmission" value={transmission} />
            </div>
            <div>
              <label htmlFor="drivetrain" className="text-sm font-medium">
                {tc("filters.drivetrain")}
              </label>
              <Select value={drivetrain || "none"} onValueChange={(v) => setDrivetrain(v === "none" ? "" : v)}>
                <SelectTrigger id="drivetrain" className={cn("mt-1", !drivetrain && "text-muted-foreground")}>
                  <SelectValue placeholder={tc("filters.drivetrain")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{tc("filters.drivetrain")}</SelectItem>
                  {DRIVETRAIN_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {tc(`drivetrains.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="drivetrain" value={drivetrain} />
            </div>
          </div>
          <div>
            <label htmlFor="color" className="text-sm font-medium">
              {tc("filters.colour")}
            </label>
            <Select value={color || "none"} onValueChange={(v) => setColor(v === "none" ? "" : v)}>
              <SelectTrigger id="color" className={cn("mt-1", !color && "text-muted-foreground")}>
                <SelectValue placeholder={tc("filters.colour")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{tc("filters.colour")}</SelectItem>
                {COLOR_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {tc(`colours.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="color" value={color} />
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
          <div>
            <p className="text-sm font-medium">Photos (optional)</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Up to 3 photos. First one is used as thumbnail on listing cards. Max 3.3MB per photo, 10MB total. JPEG, PNG or WebP.
            </p>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <label
                    htmlFor={`photo${i + 1}`}
                    className={cn(
                      "flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors",
                      previewUrls[i]
                        ? "border-border bg-muted"
                        : "border-muted-foreground/30 bg-muted/50 hover:border-muted-foreground/50 hover:bg-muted/70"
                    )}
                  >
                    {previewUrls[i] ? (
                      <>
                        <img
                          src={previewUrls[i]!}
                          alt=""
                          className="h-full w-full object-cover rounded-md"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100 rounded-lg">
                          <span className="rounded-full bg-background/90 px-2 py-1 text-xs font-medium">
                            {i === 0 ? "Thumbnail" : `Photo ${i + 1}`}
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="size-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {i === 0 ? "Photo 1 (thumbnail)" : `Photo ${i + 1}`}
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    id={`photo${i + 1}`}
                    key={`photo${i + 1}-${clearPhotoKeys[i]}`}
                    name={`photo${i + 1}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => onPhotoChange(i, e)}
                  />
                  {previewUrls[i] && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute right-1 top-1 size-7 rounded-full"
                      onClick={() => removePhoto(i)}
                      aria-label="Remove photo"
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {totalPhotoBytes > 0 && (
              <p className={cn("mt-1.5 text-xs", !totalPhotoOk && "text-destructive")}>
                Total: {(totalPhotoBytes / (1024 * 1024)).toFixed(2)} MB / 10 MB
                {!totalPhotoOk && " — over limit"}
              </p>
            )}
          </div>
          <LocationPicker mapHeight="260px" />
          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}
          <SubmitButton
            className="w-full sm:w-auto bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-8 font-bold shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98]"
            loadingText={t("creating")}
          >
            Create listing
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
