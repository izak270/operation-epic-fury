// Detailed missile inventory — Iran, Israel, USA
// Sources: CSIS Missile Defense Project, IISS, IDF, SIPRI, foreign publications

export interface MissileType {
  id: string;
  nameEn: string;
  nameHe: string;
  country: "iran" | "israel" | "usa";
  category: "SRBM" | "MRBM" | "IRBM" | "ICBM" | "cruise" | "interceptor" | "SAM";
  rangeKm: number;
  propulsion: "solid" | "liquid" | "dual-stage-solid" | "turbojet";
  warheadKg: number | null;
  preWarQty: number | null;       // estimated pre-war inventory
  unitCostUSD: number | null;     // estimated unit cost
  sourceClass: "official" | "foreign_estimate" | "mixed";
  source: string;
  noteEn?: string;
  noteHe?: string;
}

export const missileArsenal: MissileType[] = [
  // ======= IRAN =======
  {
    id: "fateh-110",
    nameEn: "Fateh-110", nameHe: "פאתח-110",
    country: "iran", category: "SRBM",
    rangeKm: 300, propulsion: "solid", warheadKg: 450,
    preWarQty: 400, unitCostUSD: 500_000,
    sourceClass: "foreign_estimate",
    source: "CSIS / IISS",
    noteEn: "CEP < 100m, high accuracy", noteHe: "דיוק גבוה, CEP < 100 מטר",
  },
  {
    id: "zolfaghar",
    nameEn: "Zolfaghar", nameHe: "זולפקאר",
    country: "iran", category: "SRBM",
    rangeKm: 700, propulsion: "solid", warheadKg: 500,
    preWarQty: 300, unitCostUSD: 800_000,
    sourceClass: "foreign_estimate",
    source: "CSIS",
  },
  {
    id: "shahab-3",
    nameEn: "Shahab-3", nameHe: "שהאב-3",
    country: "iran", category: "MRBM",
    rangeKm: 1300, propulsion: "liquid", warheadKg: 760,
    preWarQty: 500, unitCostUSD: 3_000_000,
    sourceClass: "mixed",
    source: "CSIS / IISS",
    noteEn: "Based on North Korean Nodong technology", noteHe: "מבוסס טכנולוגיה צפון-קוריאנית (נודונג)",
  },
  {
    id: "haj-qassem",
    nameEn: "Haj Qassem", nameHe: "חאג׳ קאסם",
    country: "iran", category: "MRBM",
    rangeKm: 1400, propulsion: "solid", warheadKg: 500,
    preWarQty: 200, unitCostUSD: 3_500_000,
    sourceClass: "foreign_estimate",
    source: "CSIS Missile Defense Project",
    noteEn: "CEP < 100m", noteHe: "דיוק פגיעה מתחת ל-100 מטר",
  },
  {
    id: "fattah-1",
    nameEn: "Fattah-1", nameHe: "פתאח-1",
    country: "iran", category: "MRBM",
    rangeKm: 1400, propulsion: "solid", warheadKg: 400,
    preWarQty: 100, unitCostUSD: 5_000_000,
    sourceClass: "foreign_estimate",
    source: "CSIS / Iranian state media",
    noteEn: "Claimed hypersonic with maneuvering warhead", noteHe: "מוגדר כהיפרסוני עם יכולת תמרון",
  },
  {
    id: "kheibar-shekan",
    nameEn: "Kheibar Shekan", nameHe: "חייבר שכן",
    country: "iran", category: "MRBM",
    rangeKm: 1450, propulsion: "solid", warheadKg: 500,
    preWarQty: 250, unitCostUSD: 4_000_000,
    sourceClass: "foreign_estimate",
    source: "CSIS / IISS",
    noteEn: "Short prep time, maneuverability challenges defense systems",
    noteHe: "זמני הכנה קצרים, יכולת תמרון מאתגרת מערכות הגנה",
  },
  {
    id: "sejjil",
    nameEn: "Sejjil", nameHe: "סג׳יל",
    country: "iran", category: "MRBM",
    rangeKm: 2000, propulsion: "dual-stage-solid", warheadKg: 700,
    preWarQty: 150, unitCostUSD: 6_000_000,
    sourceClass: "foreign_estimate",
    source: "CSIS / SIPRI",
    noteEn: "Highest cost Iranian missile", noteHe: "הטיל האיראני היקר ביותר",
  },
  {
    id: "khorramshahr",
    nameEn: "Khorramshahr", nameHe: "חורמשהר",
    country: "iran", category: "MRBM",
    rangeKm: 2500, propulsion: "liquid", warheadKg: 1500,
    preWarQty: 100, unitCostUSD: 7_000_000,
    sourceClass: "foreign_estimate",
    source: "CSIS / IISS",
    noteEn: "Capable of multiple warheads (MRV)", noteHe: "יכולת נשיאה של ראשי קרב מרובים",
  },
  // ======= ISRAEL =======
  {
    id: "arrow-3",
    nameEn: "Arrow 3", nameHe: "חץ 3",
    country: "israel", category: "interceptor",
    rangeKm: 2400, propulsion: "solid", warheadKg: null,
    preWarQty: null, unitCostUSD: 3_000_000,
    sourceClass: "mixed",
    source: "MoD Israel / IAI",
    noteEn: "Exo-atmospheric interceptor; accelerated production post-war",
    noteHe: "מיירט אקסו-אטמוספרי; ייצור מואץ לאחר המלחמה",
  },
  {
    id: "arrow-2",
    nameEn: "Arrow 2", nameHe: "חץ 2",
    country: "israel", category: "interceptor",
    rangeKm: 150, propulsion: "solid", warheadKg: null,
    preWarQty: null, unitCostUSD: 2_000_000,
    sourceClass: "mixed",
    source: "MoD Israel",
  },
  {
    id: "davids-sling",
    nameEn: "David's Sling", nameHe: "קלע דוד",
    country: "israel", category: "interceptor",
    rangeKm: 300, propulsion: "solid", warheadKg: null,
    preWarQty: null, unitCostUSD: 1_000_000,
    sourceClass: "official",
    source: "Rafael / MoD Israel",
  },
  {
    id: "iron-dome",
    nameEn: "Iron Dome (Tamir)", nameHe: "כיפת ברזל (תמיר)",
    country: "israel", category: "interceptor",
    rangeKm: 70, propulsion: "solid", warheadKg: null,
    preWarQty: null, unitCostUSD: 50_000,
    sourceClass: "official",
    source: "Rafael / IDF",
  },
  // ======= USA =======
  {
    id: "tlam",
    nameEn: "Tomahawk (TLAM)", nameHe: "טומהוק (TLAM)",
    country: "usa", category: "cruise",
    rangeKm: 2500, propulsion: "turbojet", warheadKg: 450,
    preWarQty: 4000, unitCostUSD: 2_000_000,
    sourceClass: "official",
    source: "US Navy / Raytheon",
    noteEn: "168 launched in first 100 hours", noteHe: "168 שוגרו ב-100 השעות הראשונות",
  },
  {
    id: "sm-3",
    nameEn: "SM-3", nameHe: "SM-3",
    country: "usa", category: "interceptor",
    rangeKm: 700, propulsion: "solid", warheadKg: null,
    preWarQty: 200, unitCostUSD: 28_000_000,
    sourceClass: "official",
    source: "MDA / Raytheon",
    noteEn: "24 fired in first 100 hours at $672M total", noteHe: "24 שוגרו ב-100 השעות הראשונות, עלות 672 מיליון דולר",
  },
  {
    id: "sm-6",
    nameEn: "SM-6", nameHe: "SM-6",
    country: "usa", category: "interceptor",
    rangeKm: 370, propulsion: "solid", warheadKg: null,
    preWarQty: 500, unitCostUSD: 4_500_000,
    sourceClass: "official",
    source: "US Navy",
  },
  {
    id: "sm-2",
    nameEn: "SM-2", nameHe: "SM-2",
    country: "usa", category: "interceptor",
    rangeKm: 170, propulsion: "solid", warheadKg: null,
    preWarQty: 1000, unitCostUSD: 2_100_000,
    sourceClass: "official",
    source: "US Navy / Raytheon",
  },
  {
    id: "jassm-er",
    nameEn: "JASSM-ER", nameHe: "JASSM-ER",
    country: "usa", category: "cruise",
    rangeKm: 925, propulsion: "turbojet", warheadKg: 450,
    preWarQty: 2000, unitCostUSD: 1_400_000,
    sourceClass: "official",
    source: "USAF / Lockheed Martin",
  },
];

// Helper to get missiles by country
export const getIranMissiles = () => missileArsenal.filter(m => m.country === "iran");
export const getIsraelMissiles = () => missileArsenal.filter(m => m.country === "israel");
export const getUSAMissiles = () => missileArsenal.filter(m => m.country === "usa");
