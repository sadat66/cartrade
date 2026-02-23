"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createListing } from "@/app/actions/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LocationPicker } from "@/components/listing/location-picker";
import { SubmitButton } from "@/components/ui/submit-button";
import { useTranslations } from "next-intl";

function formReducer(
  _state: { error?: string },
  payload: { error?: string } | null
) {
  return payload ?? {};
}

export function NewListingForm() {
  const router = useRouter();
  const t = useTranslations("common.toast");
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
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
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
            className="bg-blue-600 hover:bg-blue-700"
            loadingText={t("creating")}
          >
            Create listing
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
