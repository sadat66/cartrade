"use client";

import { FormField } from "@/components/shared/form-field";
import { LocationPicker } from "@/components/listing/location-picker";
import { MapPin } from "lucide-react";
import { StepContainer, StepHeader } from "./ui";

export function StepLocation() {
  return (
    <StepContainer>
      <StepHeader 
        icon={MapPin}
        title="Where's the Car?"
        colorClass="bg-orange-50 text-orange-600"
        description="Buyers like to know meeting distance."
      />

      <FormField label="Exact Location" description="Pin where the car is located.">
        <div className="space-y-4 pt-2">
          <LocationPicker mapHeight="420px" />
          <p className="text-[11px] font-medium text-slate-400 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#3D0066]" />
            Location is protected until verified.
          </p>
        </div>
      </FormField>
    </StepContainer>
  );
}
