"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CarDetailsTabsProps {
  title: string;
  overviewLabel: string;
  featuresLabel: string;
  specificationsLabel: string;
  specLabels: {
    vehicleDescription: string;
    powerplantType: string;
    costToInsure: string;
    bodyType: string;
    transmission: string;
    engine: string;
    fuelConsumptionCombined: string;
    registrationPlate: string;
    buildDate: string;
    checkWithSeller: string;
    batteryCapacity: string;
    electricRange: string;
    acceleration: string;
    topSpeed: string;
  };
}

// Dummy content for 2023 Porsche Taycan Turbo S - Frozen Blue Metallic
const OVERVIEW_SPECS = [
  { key: "vehicleDescription", value: "Taycan Turbo S 4-door sedan, dual motor AWD, 800V architecture, Frozen Blue Metallic" },
  { key: "powerplantType", value: "Battery Electric Vehicle (BEV)" },
  { key: "costToInsure", value: "" },
  { key: "bodyType", value: "Sedan, 4 doors, 5 seats" },
  { key: "transmission", value: "2-speed automatic (electric)" },
  { key: "engine", value: "Dual electric motors, 560 kW combined, 93.4 kWh Performance Battery Plus" },
  { key: "fuelConsumptionCombined", value: "24.8 kWh/100 km (WLTP)" },
  { key: "registrationPlate", value: "checkWithSeller" },
  { key: "buildDate", value: "checkWithSeller" },
] as const;

const FEATURES_LIST = [
  "Performance Battery Plus (93.4 kWh)",
  "Porsche Electric Sport Sound",
  "Adaptive air suspension (PASM)",
  "Rear-axle steering",
  "Porsche Dynamic Chassis Control (PDCC)",
  "Sport Chrono package",
  "Bose® surround sound system",
  "Porsche Crest on headrests",
  "Frozen Blue Metallic exterior",
  "Glass roof",
  "Lane change assist",
  "Night vision assist",
  "Head-up display",
];

const SPECS_EXTRA = [
  { key: "batteryCapacity", value: "93.4 kWh (gross)" },
  { key: "electricRange", value: "440 km (WLTP)" },
  { key: "acceleration", value: "2.8 s (0–100 km/h)" },
  { key: "topSpeed", value: "260 km/h" },
];

export function CarDetailsTabs({
  title,
  overviewLabel,
  featuresLabel,
  specificationsLabel,
  specLabels,
}: CarDetailsTabsProps) {
  return (
    <section className="bg-transparent">
      <h2 className="text-lg font-bold text-slate-900 mb-3">
        {title}
        <sup className="text-[10px] align-super ml-0.5">®</sup>
      </h2>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList variant="line" className="h-auto p-0 gap-4 border-0 bg-transparent">
          <TabsTrigger value="overview" className="px-0 pb-2 rounded-none border-0 data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600">
            {overviewLabel}
          </TabsTrigger>
          <TabsTrigger value="features" className="px-0 pb-2 rounded-none border-0 data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600">
            {featuresLabel}
          </TabsTrigger>
          <TabsTrigger value="specifications" className="px-0 pb-2 rounded-none border-0 data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600">
            {specificationsLabel}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <dl className="space-y-3 text-sm">
            {OVERVIEW_SPECS.map(({ key, value }) => {
              const label = specLabels[key as keyof typeof specLabels];
              const displayValue = value === "checkWithSeller" ? specLabels.checkWithSeller : value;
              if (key === "costToInsure" && !displayValue) return null;
              return (
                <div key={key} className="flex justify-between gap-4 py-1">
                  <dt className="text-slate-600 shrink-0">{label}</dt>
                  <dd className="text-slate-900 text-right">{displayValue || "—"}</dd>
                </div>
              );
            })}
          </dl>
        </TabsContent>
        <TabsContent value="features" className="mt-4">
          <ul className="space-y-2 text-sm text-slate-700">
            {FEATURES_LIST.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="specifications" className="mt-4">
          <dl className="space-y-3 text-sm">
            {OVERVIEW_SPECS.map(({ key, value }) => {
              const label = specLabels[key as keyof typeof specLabels];
              const displayValue = value === "checkWithSeller" ? specLabels.checkWithSeller : value;
              if (key === "costToInsure" && !displayValue) return null;
              return (
                <div key={key} className="flex justify-between gap-4 py-1">
                  <dt className="text-slate-600 shrink-0">{label}</dt>
                  <dd className="text-slate-900 text-right">{displayValue || "—"}</dd>
                </div>
              );
            })}
            {SPECS_EXTRA.map(({ key, value }) => (
              <div key={key} className="flex justify-between gap-4 py-1">
                <dt className="text-slate-600 shrink-0">{specLabels[key as keyof typeof specLabels]}</dt>
                <dd className="text-slate-900 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
      </Tabs>
    </section>
  );
}
