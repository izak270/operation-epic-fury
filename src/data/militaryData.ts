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
  note?: Record<string, string>;
}

export interface DataVersion {
  id: string;
  labelKey: string;
  date: string;
  categories: ForceCategory[];
}

// v0 — Baseline pre-war estimates (2024)
const v0Categories: ForceCategory[] = [
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

// v1 — Current estimates (March 2026)
// Sources: GlobalFirepower 2026, IISS, SIPRI, IDF official data,
// JPost, Media Line, conflict reporting
//
// Key events since baseline:
// - Gaza war (Oct 2023–present): 900+ IDF soldiers KIA, ~80 Merkava tanks damaged/destroyed
// - Lebanon invasion (Oct 2024): additional IDF losses
// - Operation Rising Lion / Epic Fury (Feb–Mar 2026):
//   Israel struck Iran — 80% of Iran air defense destroyed,
//   60% of missile launchers destroyed, 3,000+ Iranian military killed
// - Iran retaliated with ballistic missiles on Israel (limited effect, 80-90% intercepted)
// - Israel defense budget surged to $34.6B (2026)
// - USA defense budget adjusted to $831.5B (2026)
const v1Categories: ForceCategory[] = [
  {
    id: "active",
    labelKey: "cat.active",
    data: { usa: 1330000, israel: 169500, iran: 607000 },
    change: { usa: 30000, israel: -500, iran: -3000 },
    source: "GlobalFirepower 2026 / IDF data",
    note: { iran: "est." },
  },
  {
    id: "reserve",
    labelKey: "cat.reserve",
    data: { usa: 800000, israel: 465000, iran: 350000 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "GlobalFirepower 2026",
  },
  {
    id: "aircraft",
    labelKey: "cat.aircraft",
    data: { usa: 1854, israel: 237, iran: 142 },
    change: { usa: 0, israel: -4, iran: -44 },
    source: "GFP 2026 / IDF reports",
    note: { iran: "est." },
  },
  {
    id: "tanks",
    labelKey: "cat.tanks",
    data: { usa: 5500, israel: 1290, iran: 1996 },
    change: { usa: 0, israel: -80, iran: 0 },
    source: "IISS / IDF official data",
    note: { israel: "est." },
  },
  {
    id: "naval",
    labelKey: "cat.naval",
    data: { usa: 484, israel: 67, iran: 88 },
    change: { usa: 0, israel: 0, iran: -13 },
    source: "GlobalFirepower 2026",
    note: { iran: "est." },
  },
  {
    id: "missiles",
    labelKey: "cat.missiles",
    data: { usa: 1200, israel: 350, iran: 1200 },
    change: { usa: 0, israel: -50, iran: -1800 },
    source: "IDF / CSIS / JPost Mar 2026",
    note: { israel: "est.", iran: "est." },
  },
  {
    id: "budget",
    labelKey: "cat.budget",
    data: { usa: 831500000000, israel: 34600000000, iran: 10000000000 },
    change: { usa: -54500000000, israel: 11200000000, iran: 0 },
    source: "SIPRI / Knesset 2026",
    format: "currency",
  },
  {
    id: "nuclear",
    labelKey: "cat.nuclear",
    data: { usa: 5500, israel: 90, iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "FAS / SIPRI 2026",
    note: { israel: "est.", iran: "N/A" },
  },
  {
    id: "casualties",
    labelKey: "cat.casualties",
    data: { usa: 0, israel: 920, iran: 3000 },
    change: { usa: 0, israel: -920, iran: -3000 },
    source: "IDF / YNet / est. Mar 2026",
    note: { israel: "since Oct 2023", iran: "est." },
  },
];

export const dataVersions: DataVersion[] = [
  {
    id: "v0",
    labelKey: "version.v0",
    date: "2024-01",
    categories: v0Categories,
  },
  {
    id: "v1",
    labelKey: "version.v1",
    date: "2026-03",
    categories: v1Categories,
  },
];

// Default export for backward compat
export const militaryData = v1Categories;
