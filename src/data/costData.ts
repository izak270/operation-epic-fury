// Attack vs Defense cost comparison + US munitions spending breakdown
// Sources: CENTCOM, US Navy, CSIS, IDF, defense industry reports

export interface CostComparison {
  id: string;
  attackNameEn: string;
  attackNameHe: string;
  attackCostUSD: number;
  defenseNameEn: string;
  defenseNameHe: string;
  defenseCostUSD: number;
  ratio: number; // defense/attack ratio
  source: string;
}

export const costComparisons: CostComparison[] = [
  {
    id: "drone-vs-iron-dome",
    attackNameEn: "Iranian Shahed-136 drone",
    attackNameHe: "כטב\"מ שאהד-136 איראני",
    attackCostUSD: 20_000,
    defenseNameEn: "Iron Dome (Tamir)",
    defenseNameHe: "כיפת ברזל (תמיר)",
    defenseCostUSD: 50_000,
    ratio: 2.5,
    source: "CSIS / Rafael",
  },
  {
    id: "fateh-vs-davids-sling",
    attackNameEn: "Fateh-110 SRBM",
    attackNameHe: "טיל פאתח-110",
    attackCostUSD: 500_000,
    defenseNameEn: "David's Sling (Stunner)",
    defenseNameHe: "קלע דוד (סטאנר)",
    defenseCostUSD: 1_000_000,
    ratio: 2,
    source: "CSIS / Rafael",
  },
  {
    id: "shahab-vs-arrow2",
    attackNameEn: "Shahab-3 MRBM",
    attackNameHe: "טיל שהאב-3",
    attackCostUSD: 3_000_000,
    defenseNameEn: "Arrow 2",
    defenseNameHe: "חץ 2",
    defenseCostUSD: 2_000_000,
    ratio: 0.67,
    source: "CSIS / IAI",
  },
  {
    id: "kheibar-vs-arrow3",
    attackNameEn: "Kheibar Shekan MRBM",
    attackNameHe: "חייבר שכן",
    attackCostUSD: 4_000_000,
    defenseNameEn: "Arrow 3",
    defenseNameHe: "חץ 3",
    defenseCostUSD: 3_000_000,
    ratio: 0.75,
    source: "CSIS / IAI",
  },
  {
    id: "sejjil-vs-sm3",
    attackNameEn: "Sejjil MRBM",
    attackNameHe: "טיל סג׳יל",
    attackCostUSD: 6_000_000,
    defenseNameEn: "SM-3 (US Navy)",
    defenseNameHe: "SM-3 (חיל הים האמריקאי)",
    defenseCostUSD: 28_000_000,
    ratio: 4.67,
    source: "MDA / Raytheon",
  },
];

// US munitions spending breakdown — first 100 hours of Operation "Wrath"
export interface MunitionSpending {
  id: string;
  nameEn: string;
  nameHe: string;
  type: "offensive" | "defensive";
  quantity: number;
  unitCostUSD: number;
  totalCostUSD: number;
  source: string;
}

export const usMunitionsSpending: MunitionSpending[] = [
  {
    id: "tlam",
    nameEn: "Tomahawk (TLAM)", nameHe: "טומהוק",
    type: "offensive", quantity: 168,
    unitCostUSD: 2_000_000, totalCostUSD: 336_000_000,
    source: "CENTCOM / US Navy",
  },
  {
    id: "jassm",
    nameEn: "JASSM-ER", nameHe: "JASSM-ER",
    type: "offensive", quantity: 96,
    unitCostUSD: 1_400_000, totalCostUSD: 134_400_000,
    source: "USAF",
  },
  {
    id: "jdam",
    nameEn: "JDAM (guided bombs)", nameHe: "JDAM (פצצות מונחות)",
    type: "offensive", quantity: 450,
    unitCostUSD: 25_000, totalCostUSD: 11_250_000,
    source: "USAF",
  },
  {
    id: "sm3",
    nameEn: "SM-3 interceptor", nameHe: "מיירט SM-3",
    type: "defensive", quantity: 24,
    unitCostUSD: 28_000_000, totalCostUSD: 672_000_000,
    source: "MDA / US Navy",
  },
  {
    id: "sm6",
    nameEn: "SM-6 interceptor", nameHe: "מיירט SM-6",
    type: "defensive", quantity: 48,
    unitCostUSD: 4_500_000, totalCostUSD: 216_000_000,
    source: "US Navy",
  },
  {
    id: "sm2",
    nameEn: "SM-2 interceptor", nameHe: "מיירט SM-2",
    type: "defensive", quantity: 48,
    unitCostUSD: 2_100_000, totalCostUSD: 100_800_000,
    source: "US Navy",
  },
  {
    id: "patriot",
    nameEn: "Patriot PAC-3 MSE", nameHe: "פטריוט PAC-3",
    type: "defensive", quantity: 36,
    unitCostUSD: 5_400_000, totalCostUSD: 194_400_000,
    source: "US Army / Lockheed Martin",
  },
];

export const totalUSSpending100Hours = usMunitionsSpending.reduce((s, m) => s + m.totalCostUSD, 0);
