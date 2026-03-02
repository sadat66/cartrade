"use client";

import { FormField } from "@/components/shared/form-field";
import { LocationPicker } from "@/components/listing/location-picker";
import { MapPin } from "lucide-react";
import { StepContainer, StepHeader } from "./ui";

export function StepLocation({ data, onChange }: { data: any; onChange: (field: string, value: any) => void }) {
  return (
    <StepContainer>
      <StepHeader 
        icon={MapPin}
        title="Where's the Car?"
        colorClass="bg-orange-50 text-orange-600"
        description="Buyers like to know meeting distance."
      />

      <div className="space-y-6">
        <FormField label="Physical Address" id="location" description="City, State, or exact address." required>
           <LocationPicker 
            mapHeight="420px" 
            defaultLocation={data.location}
            defaultLat={data.latitude ? Number(data.latitude) : null}
            defaultLng={data.longitude ? Number(data.longitude) : null}
            onLocationChange={(loc, lat, lng) => {
              onChange("location", loc);
              onChange("latitude", lat);
              onChange("longitude", lng);
            }}
           />
        </FormField>
        <p className="text-[11px] font-medium text-slate-400 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#3D0066]" />
            Location is protected until verified.
          </p>
      </div>
    </StepContainer>
  );
}
