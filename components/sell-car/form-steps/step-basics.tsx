"use client";

import { useTranslations } from "next-intl";
import { FormInput } from "@/components/shared/form-field";
import { Car } from "lucide-react";
import { StepContainer, StepHeader, FormSelect } from "./ui";
import { BODY_TYPE_KEYS } from "./constants";

export function StepVehicleBasics({ data, onChange }: { 
  data: any;
  onChange: (field: string, value: any) => void;
}) {
  const tHero = useTranslations("hero");
  return (
    <StepContainer>
      <StepHeader 
        icon={Car}
        title="Vehicle Identity"
        description="Tell us the core details of the car you're selling."
      />

      <FormInput
        id="title"
        name="title"
        label="Listing Title"
        value={data.title}
        onChange={(e) => onChange("title", e.target.value)}
        description="Write a clear title that includes the year, make, and model."
        placeholder="e.g. 2022 Toyota Camry Ascent Sport"
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput
          id="make"
          name="make"
          label="Make"
          value={data.make}
          onChange={(e) => onChange("make", e.target.value)}
          placeholder="e.g. Toyota"
          required
        />
        <FormInput
          id="model"
          name="model"
          label="Model"
          value={data.model}
          onChange={(e) => onChange("model", e.target.value)}
          placeholder="e.g. Camry"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput
          id="year"
          name="year"
          type="number"
          min={1900}
          max={2100}
          label="Year"
          value={data.year}
          onChange={(e) => onChange("year", e.target.value)}
          description="The manufacturing year."
          placeholder="2022"
          required
        />
        {data.dealershipId && (
          <FormSelect 
            name="condition"
            label="Condition"
            description="Condition of the car."
            options={["new", "used", "certified"]}
            value={data.condition || "used"}
            onValueChange={(v) => onChange("condition", v)}
            placeholder="Select"
            required
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormSelect 
          name="bodyType"
          label="Body Type"
          description="Select the shape."
          options={BODY_TYPE_KEYS}
          value={data.bodyType}
          onValueChange={(v) => onChange("bodyType", v)}
          placeholder={tHero("anyBodyType")}
          required
        />
        {!data.dealershipId && <div />} {/* Spacer if only bodyType is visible */}
      </div>
    </StepContainer>
  );
}
