export interface CountryForce {
  usa: number | string;
  israel: number | string;
  iran: number | string;
}

export interface ForceCategory {
  id: string;
  labelKey: string;
  data: CountryForce;
  change: CountryForce;
  source: string;
  format?: "currency" | "number";
  note?: Record<string, string>; // country -> note like "est."
}

export const militaryData: ForceCategory[] = [
  {
    id: "active",
    labelKey: "cat.active",
    data: { usa: 1300000, israel: 170000, iran: 610000 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "GlobalFirepower 2024",
  },
  {
    id: "reserve",
    labelKey: "cat.reserve",
    data: { usa: 800000, israel: 465000, iran: 350000 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "GlobalFirepower 2024",
  },
  {
    id: "aircraft",
    labelKey: "cat.aircraft",
    data: { usa: 1854, israel: 241, iran: 186 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "GlobalFirepower 2024",
  },
  {
    id: "tanks",
    labelKey: "cat.tanks",
    data: { usa: 5500, israel: 1370, iran: 1996 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "IISS Military Balance 2024",
  },
  {
    id: "naval",
    labelKey: "cat.naval",
    data: { usa: 484, israel: 67, iran: 101 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "GlobalFirepower 2024",
  },
  {
    id: "missiles",
    labelKey: "cat.missiles",
    data: { usa: 1200, israel: 400, iran: 3000 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "CSIS / IISS estimates",
    note: { israel: "est.", iran: "est." },
  },
  {
    id: "budget",
    labelKey: "cat.budget",
    data: { usa: 886000000000, israel: 23400000000, iran: 10000000000 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "SIPRI 2024",
    format: "currency",
  },
  {
    id: "nuclear",
    labelKey: "cat.nuclear",
    data: { usa: 5500, israel: 90, iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "FAS / SIPRI 2024",
    note: { israel: "est.", iran: "N/A" },
  },
];
