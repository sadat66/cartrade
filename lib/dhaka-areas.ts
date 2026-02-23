/**
 * Dhaka city areas for location autocomplete and map.
 * Coordinates are approximate centers of each area.
 */
export interface DhakaArea {
  name: string;
  label: string; // "Area, Dhaka" for display
  lat: number;
  lng: number;
}

export const DHAKA_CENTER = { lat: 23.8103, lng: 90.4125 } as const;

// Bounds that roughly cover Dhaka city (for map restrict)
export const DHAKA_BOUNDS = {
  south: 23.65,
  north: 23.95,
  west: 90.25,
  east: 90.55,
} as const;

export const DHAKA_AREAS: DhakaArea[] = [
  { name: "Gulshan", label: "Gulshan, Dhaka", lat: 23.7979, lng: 90.4144 },
  { name: "Banani", label: "Banani, Dhaka", lat: 23.795, lng: 90.405 },
  { name: "Dhanmondi", label: "Dhanmondi, Dhaka", lat: 23.7462, lng: 90.3766 },
  { name: "Uttara", label: "Uttara, Dhaka", lat: 23.8752, lng: 90.3791 },
  { name: "Mirpur", label: "Mirpur, Dhaka", lat: 23.8069, lng: 90.3687 },
  { name: "Motijheel", label: "Motijheel, Dhaka", lat: 23.7316, lng: 90.4186 },
  { name: "Bashundhara", label: "Bashundhara, Dhaka", lat: 23.8133, lng: 90.4234 },
  { name: "Badda", label: "Badda, Dhaka", lat: 23.7822, lng: 90.4264 },
  { name: "Rampura", label: "Rampura, Dhaka", lat: 23.7583, lng: 90.4089 },
  { name: "Shahbagh", label: "Shahbagh, Dhaka", lat: 23.7392, lng: 90.3931 },
  { name: "Mohakhali", label: "Mohakhali, Dhaka", lat: 23.7795, lng: 90.4054 },
  { name: "Baridhara", label: "Baridhara, Dhaka", lat: 23.8089, lng: 90.4222 },
  { name: "Niketan", label: "Niketan, Dhaka", lat: 23.7872, lng: 90.4117 },
  { name: "Mohammadpur", label: "Mohammadpur, Dhaka", lat: 23.7642, lng: 90.3589 },
  { name: "Farmgate", label: "Farmgate, Dhaka", lat: 23.7542, lng: 90.3858 },
  { name: "Tejgaon", label: "Tejgaon, Dhaka", lat: 23.7611, lng: 90.3989 },
  { name: "Karwan Bazar", label: "Karwan Bazar, Dhaka", lat: 23.7486, lng: 90.4089 },
  { name: "Lalmatia", label: "Lalmatia, Dhaka", lat: 23.7522, lng: 90.3717 },
  { name: "Adabor", label: "Adabor, Dhaka", lat: 23.7472, lng: 90.3636 },
  { name: "Jatrabari", label: "Jatrabari, Dhaka", lat: 23.7167, lng: 90.4458 },
  { name: "Khilgaon", label: "Khilgaon, Dhaka", lat: 23.7358, lng: 90.4314 },
  { name: "Malibagh", label: "Malibagh, Dhaka", lat: 23.7489, lng: 90.4289 },
  { name: "Paltan", label: "Paltan, Dhaka", lat: 23.7311, lng: 90.4136 },
  { name: "Old Dhaka", label: "Old Dhaka", lat: 23.7106, lng: 90.4078 },
  { name: "Cantonment", label: "Cantonment, Dhaka", lat: 23.8336, lng: 90.4011 },
  { name: "Demra", label: "Demra, Dhaka", lat: 23.7589, lng: 90.4689 },
  { name: "Shyamoli", label: "Shyamoli, Dhaka", lat: 23.7622, lng: 90.3689 },
  { name: "Kallyanpur", label: "Kallyanpur, Dhaka", lat: 23.7736, lng: 90.3736 },
  { name: "Hazaribagh", label: "Hazaribagh, Dhaka", lat: 23.7289, lng: 90.3689 },
];

export function findAreaByQuery(query: string): DhakaArea[] {
  const q = query.trim().toLowerCase();
  if (!q) return DHAKA_AREAS;
  return DHAKA_AREAS.filter(
    (a) =>
      a.name.toLowerCase().includes(q) || a.label.toLowerCase().includes(q)
  );
}

export function findAreaByLabel(label: string): DhakaArea | undefined {
  return DHAKA_AREAS.find(
    (a) => a.label.toLowerCase() === label.toLowerCase()
  );
}

export function findNearestArea(lat: number, lng: number): DhakaArea {
  let nearest = DHAKA_AREAS[0];
  let minDist = Infinity;
  for (const a of DHAKA_AREAS) {
    const d = (a.lat - lat) ** 2 + (a.lng - lng) ** 2;
    if (d < minDist) {
      minDist = d;
      nearest = a;
    }
  }
  return nearest;
}
