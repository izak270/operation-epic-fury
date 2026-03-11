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
    id: "mil_kia",
    labelKey: "cat.mil_kia",
    data: { usa: 0, israel: 920, iran: 3000 },
    change: { usa: 0, israel: -920, iran: -3000 },
    source: "IDF / YNet / est. Mar 2026",
    note: { israel: "since Oct 2023", iran: "est." },
  },
  {
    id: "civ_killed",
    labelKey: "cat.civ_killed",
    data: { usa: 0, israel: 1139, iran: 1332 },
    change: { usa: 0, israel: -1139, iran: -1332 },
    source: "MoH / Reuters / Al Jazeera Mar 2026",
    note: { israel: "inc. Oct 7", iran: "Iran claim" },
  },
  {
    id: "civ_killed_other",
    labelKey: "cat.civ_killed_other",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Gaza MoH / Lebanon MoH / Lancet",
    note: { usa: "N/A", israel: "N/A", iran: "N/A" },
  },
  {
    id: "gaza_killed",
    labelKey: "cat.gaza_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Gaza MoH / Lancet Feb 2026",
  },
  {
    id: "lebanon_killed",
    labelKey: "cat.lebanon_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Lebanon MoH Nov 2024",
  },
];

// v2 — Post-ceasefire assessment (March 10, 2026)
// Adds ammunition, air defense, UAV/drone fleet, interceptor stockpile categories
const v2Categories: ForceCategory[] = [
  // === FORCE STRUCTURE ===
  {
    id: "active",
    labelKey: "cat.active",
    data: { usa: 1328000, israel: 169200, iran: 604000 },
    change: { usa: -2000, israel: -300, iran: -3000 },
    source: "GlobalFirepower 2026 / IDF Mar 10",
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
    data: { usa: 1852, israel: 235, iran: 128 },
    change: { usa: -2, israel: -6, iran: -58 },
    source: "GFP 2026 / CENTCOM Mar 10",
    note: { iran: "est." },
  },
  {
    id: "tanks",
    labelKey: "cat.tanks",
    data: { usa: 5500, israel: 1280, iran: 1940 },
    change: { usa: 0, israel: -90, iran: -56 },
    source: "IISS / IDF / CENTCOM",
    note: { israel: "est.", iran: "est." },
  },
  {
    id: "naval",
    labelKey: "cat.naval",
    data: { usa: 483, israel: 67, iran: 74 },
    change: { usa: -1, israel: 0, iran: -27 },
    source: "GlobalFirepower 2026 / USN",
    note: { iran: "est." },
  },
  // === NEW: AMMUNITION / MUNITIONS ===
  {
    id: "ammunition",
    labelKey: "cat.ammunition",
    data: { usa: 870, israel: 48, iran: 420 },
    change: { usa: -330, israel: -52, iran: -580 },
    source: "CENTCOM / IDF / CSIS Mar 2026",
    format: "number",
    note: { usa: "TLAM+JASSM+JDAM", israel: "interceptors", iran: "ballistic+cruise" },
  },
  {
    id: "interceptors",
    labelKey: "cat.interceptors",
    data: { usa: 1576, israel: 780, iran: "N/A" },
    change: { usa: -156, israel: -420, iran: 0 },
    source: "MDA / Rafael / IAI Mar 2026",
    note: { usa: "SM-2/3/6+PAC-3", israel: "ID+DS+Arrow" },
  },
  // === NEW: AIR DEFENSE SYSTEMS ===
  {
    id: "air_defense",
    labelKey: "cat.air_defense",
    data: { usa: 60, israel: 15, iran: 8 },
    change: { usa: 0, israel: 0, iran: -37 },
    source: "IISS / CSIS satellite Mar 2026",
    note: { iran: "80% destroyed" },
  },
  // === NEW: UAV / DRONE FLEET ===
  {
    id: "uav_fleet",
    labelKey: "cat.uav_fleet",
    data: { usa: 957, israel: 480, iran: 1200 },
    change: { usa: 0, israel: -20, iran: -3850 },
    source: "GFP 2026 / CENTCOM / est.",
    note: { iran: "est. remaining" },
  },
  // === MISSILES ===
  {
    id: "missiles",
    labelKey: "cat.missiles",
    data: { usa: 1200, israel: 340, iran: 800 },
    change: { usa: 0, israel: -60, iran: -2200 },
    source: "CSIS / IDF / CENTCOM Mar 10",
    note: { israel: "est.", iran: "est." },
  },
  // === TEL LAUNCHERS ===
  {
    id: "tel_launchers",
    labelKey: "cat.tel_launchers",
    data: { usa: "N/A", israel: "N/A", iran: 120 },
    change: { usa: 0, israel: 0, iran: -180 },
    source: "CENTCOM / CSIS satellite Mar 10",
    note: { iran: "60% destroyed" },
  },
  // === BUDGET ===
  {
    id: "budget",
    labelKey: "cat.budget",
    data: { usa: 831500000000, israel: 37200000000, iran: 10000000000 },
    change: { usa: -54500000000, israel: 13800000000, iran: 0 },
    source: "SIPRI / Knesset / MoD Mar 2026",
    format: "currency",
    note: { israel: "wartime supplement" },
  },
  // === NUCLEAR ===
  {
    id: "nuclear",
    labelKey: "cat.nuclear",
    data: { usa: 5500, israel: 90, iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "FAS / SIPRI 2026",
    note: { israel: "est.", iran: "128kg 60% HEU" },
  },
  // === MUNITIONS COST ===
  {
    id: "munitions_cost",
    labelKey: "cat.munitions_cost",
    data: { usa: 1665000000, israel: 2100000000, iran: 4500000000 },
    change: { usa: -1665000000, israel: -2100000000, iran: -4500000000 },
    source: "CENTCOM / IDF / CSIS est.",
    format: "currency",
    note: { usa: "100 hrs", israel: "10 days", iran: "10 days" },
  },
  // === CASUALTIES ===
  {
    id: "mil_kia",
    labelKey: "cat.mil_kia",
    data: { usa: 12, israel: 935, iran: 4200 },
    change: { usa: -12, israel: -935, iran: -4200 },
    source: "CENTCOM / IDF / est. Mar 10",
    note: { usa: "in theater", israel: "since Oct 2023", iran: "est." },
  },
  {
    id: "civ_killed",
    labelKey: "cat.civ_killed",
    data: { usa: 0, israel: 1145, iran: 2100 },
    change: { usa: 0, israel: -1145, iran: -2100 },
    source: "MoH / Reuters / Al Jazeera Mar 10",
    note: { israel: "inc. Oct 7", iran: "Iran claim" },
  },
  {
    id: "civ_killed_other",
    labelKey: "cat.civ_killed_other",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Gaza MoH / Lebanon MoH / Lancet",
    note: { usa: "N/A", israel: "N/A", iran: "N/A" },
  },
  {
    id: "gaza_killed",
    labelKey: "cat.gaza_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Gaza MoH / Lancet Mar 2026",
  },
  {
    id: "lebanon_killed",
    labelKey: "cat.lebanon_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Lebanon MoH Nov 2024",
  },
];

// v3 — Deep Research automated update (March 11, 2026)
// Source: Gemini Deep Research agent batch 485219a3
const v3Categories: ForceCategory[] = [
  {
    id: "active",
    labelKey: "cat.active",
    data: { usa: 1300000, israel: 170000, iran: 610000 },
    change: { usa: -28000, israel: 800, iran: 6000 },
    source: "CFR Feb 2026 / IISS 2026 / Deep Research",
    note: { usa: "recruitment decline", iran: "stable" },
  },
  {
    id: "reserve",
    labelKey: "cat.reserve",
    data: { usa: 800000, israel: 465000, iran: 350000 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "GlobalFirepower 2026 / IDF Mar 2026",
  },
  {
    id: "aircraft",
    labelKey: "cat.aircraft",
    data: { usa: 1850, israel: 241, iran: 186 },
    change: { usa: -2, israel: 6, iran: 58 },
    source: "USAF Jan 2026 / GFP 2026 / CSIS",
    note: { usa: "F-35 replacing F-16", iran: "aging fleet, no new deliveries" },
  },
  {
    id: "tanks",
    labelKey: "cat.tanks",
    data: { usa: 5500, israel: 1300, iran: 1996 },
    change: { usa: 0, israel: 20, iran: 56 },
    source: "IISS 2026 / CSIS Feb 2026",
    note: { israel: "Merkava V production", iran: "Karrar domestic" },
  },
  {
    id: "naval",
    labelKey: "cat.naval",
    data: { usa: 480, israel: 67, iran: 101 },
    change: { usa: -3, israel: 0, iran: 27 },
    source: "USN Jan 2026 / Iran Navy Jan 2026",
    note: { iran: "patrol boats added" },
  },
  {
    id: "ammunition",
    labelKey: "cat.ammunition",
    data: { usa: 900, israel: 55, iran: 450 },
    change: { usa: 30, israel: 7, iran: 30 },
    source: "DoD Industrial Base Jan 2026 / IDF / Deep Research",
    format: "number",
    note: { usa: "replenishment ongoing", israel: "interceptors", iran: "domestic production" },
  },
  {
    id: "interceptors",
    labelKey: "cat.interceptors",
    data: { usa: 1600, israel: 820, iran: "N/A" },
    change: { usa: 24, israel: 40, iran: 0 },
    source: "MDA Feb 2026 / Rafael / IAI",
    note: { usa: "SM-2/3/6+PAC-3", israel: "ID+DS+Arrow replenished" },
  },
  {
    id: "air_defense",
    labelKey: "cat.air_defense",
    data: { usa: 60, israel: 15, iran: 12 },
    change: { usa: 0, israel: 0, iran: 4 },
    source: "MDA Feb 2026 / Iran MoD Feb 2026",
    note: { iran: "Bavar-373 + Khordad-15 added" },
  },
  {
    id: "uav_fleet",
    labelKey: "cat.uav_fleet",
    data: { usa: 1100, israel: 500, iran: 2000 },
    change: { usa: 143, israel: 20, iran: 800 },
    source: "DIA Feb 2026 / Janes Feb 2026 / Western Intel",
    note: { usa: "AI-enabled expansion", iran: "Shahed mass production" },
  },
  {
    id: "missiles",
    labelKey: "cat.missiles",
    data: { usa: 1200, israel: 350, iran: 1200 },
    change: { usa: 0, israel: 10, iran: 400 },
    source: "UN SC Jan 2026 / IDF / Deep Research",
    note: { iran: "domestic production recovering" },
  },
  {
    id: "tel_launchers",
    labelKey: "cat.tel_launchers",
    data: { usa: "N/A", israel: "N/A", iran: 200 },
    change: { usa: 0, israel: 0, iran: 80 },
    source: "DIA Jan 2026 / CENTCOM",
    note: { iran: "mobile TEL emphasis" },
  },
  {
    id: "budget",
    labelKey: "cat.budget",
    data: { usa: 886000000000, israel: 29000000000, iran: 27000000000 },
    change: { usa: 54500000000, israel: -8200000000, iran: 17000000000 },
    source: "CBO Feb 2026 / Israel MoF / SIPRI Jan 2026",
    format: "currency",
    note: { usa: "FY2026", iran: "est. SIPRI + IISS" },
  },
  {
    id: "nuclear",
    labelKey: "cat.nuclear",
    data: { usa: 5044, israel: 90, iran: "N/A" },
    change: { usa: -456, israel: 0, iran: 0 },
    source: "SIPRI Jan 2026 / FAS / IAEA Feb 2026",
    note: { usa: "New START compliance", iran: "enrichment ongoing, no weapon" },
  },
  {
    id: "munitions_cost",
    labelKey: "cat.munitions_cost",
    data: { usa: 1665000000, israel: 2100000000, iran: 4500000000 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "CENTCOM / IDF / CSIS est.",
    format: "currency",
    note: { usa: "100 hrs", israel: "10 days", iran: "10 days" },
  },
  {
    id: "mil_kia",
    labelKey: "cat.mil_kia",
    data: { usa: 12, israel: 935, iran: 4200 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "CENTCOM / IDF / est. Mar 11",
    note: { usa: "in theater", israel: "since Oct 2023", iran: "est." },
  },
  {
    id: "civ_killed",
    labelKey: "cat.civ_killed",
    data: { usa: 0, israel: 1145, iran: 2100 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "MoH / Reuters / Al Jazeera Mar 11",
    note: { israel: "inc. Oct 7", iran: "Iran claim" },
  },
  {
    id: "civ_killed_other",
    labelKey: "cat.civ_killed_other",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Gaza MoH / Lebanon MoH / Lancet",
  },
  {
    id: "gaza_killed",
    labelKey: "cat.gaza_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Gaza MoH / Lancet Mar 2026",
  },
  {
    id: "lebanon_killed",
    labelKey: "cat.lebanon_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Lebanon MoH Nov 2024",
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
  {
    id: "v2",
    labelKey: "version.v2",
    date: "2026-03-10",
    categories: v2Categories,
  },
  {
    id: "v3",
    labelKey: "version.v3",
    date: "2026-03-11",
    categories: v3Categories,
  },
];

// Default export for backward compat
export const militaryData = v3Categories;
