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

// v3 — Fact-checked update (March 11, 2026)
// Sources verified against: CSIS, CENTCOM, IDF, Times of Israel, ISW, IAEA, Alma Center, Iran Watch
const v3Categories: ForceCategory[] = [
  {
    id: "active",
    labelKey: "cat.active",
    data: { usa: 1341300, israel: 169500, iran: 610000 },
    change: { usa: 13300, israel: 300, iran: 6000 },
    source: "GlobalFirepower 2026 / IDF",
    note: { usa: "2026 recruitment targets" },
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
    data: { usa: 1850, israel: 241, iran: 192 },
    change: { usa: -2, israel: 6, iran: 64 },
    source: "USAF Jan 2026 / GlobalFirepower 2026 / CSIS",
    note: { iran: "aging fleet: F-4, F-5, F-14, MiG-29" },
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
    source: "US Navy Jan 2026 / GlobalFirepower 2026",
  },
  // === AMMUNITION / MUNITIONS (VERIFIED) ===
  {
    id: "ammunition",
    labelKey: "cat.ammunition",
    data: { usa: 2800, israel: 6500, iran: 5970 },
    change: { usa: 1930, israel: 6452, iran: 5550 },
    source: "CSIS / CENTCOM / IDF / Alma",
    format: "number",
    note: { usa: "100 hrs air+sea", israel: "150 strike waves", iran: "2,410 BM + 3,560 UAV" },
  },
  {
    id: "interceptors",
    labelKey: "cat.interceptors",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "MDA / IAI — classified",
    note: { usa: "SM series — accelerated procurement", israel: "Arrow 3 — accelerated production" },
  },
  {
    id: "air_defense",
    labelKey: "cat.air_defense",
    data: { usa: 60, israel: 15, iran: 12 },
    change: { usa: 0, israel: 0, iran: 4 },
    source: "MDA Feb 2026 / CSIS satellite",
    note: { iran: "Bavar-373 + Khordad-15 added" },
  },
  {
    id: "uav_fleet",
    labelKey: "cat.uav_fleet",
    data: { usa: 1100, israel: 500, iran: 2000 },
    change: { usa: 143, israel: 20, iran: 800 },
    source: "CSIS / Janes Feb 2026",
    note: { iran: "2,000+ Shahed launched in conflict alone" },
  },
  {
    id: "missiles",
    labelKey: "cat.missiles",
    data: { usa: 1200, israel: 350, iran: 1200 },
    change: { usa: 0, israel: 10, iran: 400 },
    source: "Times of Israel / Iran Watch / CSIS",
    note: { iran: "pre-war: 2,500 BMs" },
  },
  {
    id: "tel_launchers",
    labelKey: "cat.tel_launchers",
    data: { usa: "N/A", israel: "N/A", iran: 150 },
    change: { usa: 0, israel: 0, iran: 30 },
    source: "ISW / CENTCOM / CSIS satellite",
    note: { iran: "100-200 est. remaining, 60%+ destroyed" },
  },
  // === BUDGET (VERIFIED) ===
  {
    id: "budget",
    labelKey: "cat.budget",
    data: { usa: 961600000000, israel: 36000000000, iran: 7900000000 },
    change: { usa: 130100000000, israel: -1200000000, iran: -2100000000 },
    source: "CBO FY2026 / EPC / SIPRI 2024",
    format: "currency",
    note: { usa: "$848.3B base + $113.3B supplemental", israel: "₪112B wartime", iran: "SIPRI 2024" },
  },
  {
    id: "nuclear",
    labelKey: "cat.nuclear",
    data: { usa: 5044, israel: 90, iran: "N/A" },
    change: { usa: -456, israel: 0, iran: 0 },
    source: "FAS / SIPRI Jan 2026 / IAEA",
    note: { usa: "New START compliance", iran: "440kg 60% HEU pre-strikes" },
  },
  // === MUNITIONS COST (VERIFIED) ===
  {
    id: "munitions_cost",
    labelKey: "cat.munitions_cost",
    data: { usa: 3100000000, israel: 2100000000, iran: 4500000000 },
    change: { usa: -3100000000, israel: -2100000000, iran: -4500000000 },
    source: "CSIS / CENTCOM / IDF est.",
    format: "currency",
    note: { usa: "100 hrs total", israel: "10 days", iran: "10 days" },
  },
  // === CASUALTIES (VERIFIED) ===
  {
    id: "mil_kia",
    labelKey: "cat.mil_kia",
    data: { usa: 9, israel: 935, iran: 3000 },
    change: { usa: -9, israel: -935, iran: -3000 },
    source: "CENTCOM / IDF / ISW Mar 11",
    note: { usa: "confirmed", israel: "since Oct 2023", iran: "~1,900 IRGC seniors" },
  },
  {
    id: "civ_killed",
    labelKey: "cat.civ_killed",
    data: { usa: 0, israel: 1155, iran: 1332 },
    change: { usa: 0, israel: -1155, iran: -1332 },
    source: "Alma / Reuters / Al Jazeera Mar 11",
    note: { israel: "1,139 Oct 7 + 16 Iran war", iran: "confirmed minimum" },
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
    source: "Gaza MoH / Al Jazeera Mar 2026",
  },
  {
    id: "lebanon_killed",
    labelKey: "cat.lebanon_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Lebanon MoH Mar 2026",
  },
];

// v4 — Deep Research automated update (March 11, 2026 evening)
// Source: Gemini Deep Research via GlobalFirepower 2026 + CSIS + open sources
const v4Categories: ForceCategory[] = [
  {
    id: "active",
    labelKey: "cat.active",
    data: { usa: 1333030, israel: 169500, iran: 610000 },
    change: { usa: -8270, israel: 0, iran: 0 },
    source: "GlobalFirepower 2026 (Deep Research)",
  },
  {
    id: "reserve",
    labelKey: "cat.reserve",
    data: { usa: 799500, israel: 465000, iran: 350000 },
    change: { usa: -500, israel: 0, iran: 0 },
    source: "GlobalFirepower 2026 (Deep Research)",
  },
  {
    id: "aircraft",
    labelKey: "cat.aircraft",
    data: { usa: 2717, israel: 284, iran: 209 },
    change: { usa: 867, israel: 43, iran: 17 },
    source: "GlobalFirepower 2026 (Deep Research)",
    note: { usa: "1791 fighters + 926 attack", israel: "239 fighters + 45 attack", iran: "188 fighters + 21 attack" },
  },
  {
    id: "tanks",
    labelKey: "cat.tanks",
    data: { usa: 5500, israel: 1300, iran: 1996 },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "IISS 2026 (adjusted from GFP all-armor totals)",
    note: { usa: "GFP total armor: 414,326", israel: "GFP total armor: 63,680", iran: "GFP total armor: 78,614" },
  },
  {
    id: "naval",
    labelKey: "cat.naval",
    data: { usa: 465, israel: 67, iran: 109 },
    change: { usa: -15, israel: 0, iran: 8 },
    source: "GlobalFirepower 2026 (Deep Research)",
  },
  {
    id: "ammunition",
    labelKey: "cat.ammunition",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Classified — Deep Research",
    format: "number",
    note: { usa: "highly dynamic", israel: "PGM stocks classified", iran: "classified" },
  },
  {
    id: "interceptors",
    labelKey: "cat.interceptors",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Classified — Deep Research",
    note: { usa: "SM-3/PAC-3/THAAD classified", israel: "ID/DS/Arrow classified", iran: "SAM stocks classified" },
  },
  {
    id: "air_defense",
    labelKey: "cat.air_defense",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Classified — Deep Research",
    note: { usa: "battery count unavailable", israel: "ID/DS/Arrow classified", iran: "Bavar-373/S-300 classified" },
  },
  {
    id: "uav_fleet",
    labelKey: "cat.uav_fleet",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Classified / Unavailable — Deep Research",
    note: { iran: "mass production ongoing" },
  },
  {
    id: "missiles",
    labelKey: "cat.missiles",
    data: { usa: "N/A", israel: "N/A", iran: 3000 },
    change: { usa: 0, israel: 0, iran: 1800 },
    source: "CSIS Missile Threat (Deep Research)",
    note: { usa: "classified", israel: "Jericho family classified", iran: "broad est. thousands" },
  },
  {
    id: "tel_launchers",
    labelKey: "cat.tel_launchers",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "CSIS Missile Threat — classified",
  },
  {
    id: "budget",
    labelKey: "cat.budget",
    data: { usa: 831500000000, israel: 34600000000, iran: 9230000000 },
    change: { usa: -130100000000, israel: -1400000000, iran: 1330000000 },
    source: "GlobalFirepower 2026 (Deep Research)",
    format: "currency",
    note: { usa: "GFP figure, lower than CBO FY2026", iran: "higher than SIPRI $7.9B" },
  },
  {
    id: "nuclear",
    labelKey: "cat.nuclear",
    data: { usa: 5244, israel: 85, iran: "N/A" },
    change: { usa: 200, israel: -5, iran: 0 },
    source: "Historical stockpiles (Deep Research)",
    note: { israel: "est.", iran: "no assembled weapon" },
  },
  {
    id: "munitions_cost",
    labelKey: "cat.munitions_cost",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Classified — Deep Research",
    format: "currency",
  },
  {
    id: "mil_kia",
    labelKey: "cat.mil_kia",
    data: { usa: "N/A", israel: 20646, iran: "N/A" },
    change: { usa: 0, israel: 19711, iran: 0 },
    source: "Casualties of the Israel-Hamas war (Deep Research)",
    note: { israel: "646 KIA + 20,000 rehab", iran: "unverified" },
  },
  {
    id: "civ_killed",
    labelKey: "cat.civ_killed",
    data: { usa: "N/A", israel: 1508, iran: "N/A" },
    change: { usa: 0, israel: 353, iran: 0 },
    source: "Casualties of the Israel-Hamas war (Deep Research)",
    note: { israel: "828 Oct 7 + 680 injuries est." },
  },
  {
    id: "civ_killed_other",
    labelKey: "cat.civ_killed_other",
    data: { usa: "N/A", israel: "N/A", iran: "N/A" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Deep Research",
  },
  {
    id: "gaza_killed",
    labelKey: "cat.gaza_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Gaza MoH (Deep Research)",
  },
  {
    id: "lebanon_killed",
    labelKey: "cat.lebanon_killed",
    data: { usa: "—", israel: "—", iran: "—" },
    change: { usa: 0, israel: 0, iran: 0 },
    source: "Lebanon MoH (Deep Research)",
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
  {
    id: "v4",
    labelKey: "version.v4",
    date: "2026-03-11",
    categories: v4Categories,
  },
];

// Default export for backward compat
export const militaryData = v4Categories;
