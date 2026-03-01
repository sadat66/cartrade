"use client";

import { useTranslations } from "next-intl";
import { FormInput } from "@/components/shared/form-field";
import { Settings } from "lucide-react";
import { StepContainer, StepHeader, FormSelect } from "./ui";
import { TRANSMISSION_KEYS, DRIVETRAIN_KEYS, COLOR_KEYS } from "./constants";

export function StepTechnicalSpecs({ data, onChange }: { 
    data: any;
    onChange: (field: string, value: any) => void;
}) {
  const tc = useTranslations("cars");
  return (
    <StepContainer>
      <StepHeader 
        icon={Settings}
        title="Technical Specs"
        colorClass="bg-blue-50 text-blue-600"
        description="Specify the engineering and visual details."
      />

      <FormInput
        id="mileage"
        name="mileage"
        type="number"
        min={0}
        label="Mileage"
        value={data.mileage}
        onChange={(e) => onChange("mileage", e.target.value)}
        description="Total kilometers traveled."
        placeholder="e.g. 45000"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormSelect 
          name="transmission"
          label="Transmission"
          options={TRANSMISSION_KEYS}
          value={data.transmission}
          onValueChange={(v) => onChange("transmission", v)}
          placeholder={tc("filters.transmission")}
        />
        <FormSelect 
          name="drivetrain"
          label="Drivetrain"
          options={DRIVETRAIN_KEYS}
          value={data.drivetrain}
          onValueChange={(v) => onChange("drivetrain", v)}
          placeholder={tc("filters.drivetrain")}
        />
      </div>
      
      <FormSelect 
        name="color"
        label="Exterior Color"
        options={COLOR_KEYS}
        value={data.color}
        onValueChange={(v) => onChange("color", v)}
        placeholder={tc("filters.colour")}
      />
    </StepContainer>
  );
}
