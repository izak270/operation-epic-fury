// Geographic distribution of Iranian fire during Operation "Wrath" (Feb-Mar 2026)
// Sources: CENTCOM, IDF, Gulf state defense ministries, JPost

export interface TargetRegion {
  id: string;
  nameEn: string;
  nameHe: string;
  percent: number;
  estimatedProjectiles: number;
  interceptRatePercent: number;
  source: string;
}

export const targetDistribution: TargetRegion[] = [
  {
    id: "uae",
    nameEn: "UAE (Al Dhafra / US bases)",
    nameHe: "איחוד האמירויות (אל-דפרה / בסיסי ארה\"ב)",
    percent: 48,
    estimatedProjectiles: 2160,
    interceptRatePercent: 94,
    source: "CENTCOM / UAE MoD",
  },
  {
    id: "israel",
    nameEn: "Israel",
    nameHe: "ישראל",
    percent: 12.8,
    estimatedProjectiles: 576,
    interceptRatePercent: 89,
    source: "IDF Spokesperson",
  },
  {
    id: "kuwait",
    nameEn: "Kuwait (US bases)",
    nameHe: "כווית (בסיסי ארה\"ב)",
    percent: 15,
    estimatedProjectiles: 675,
    interceptRatePercent: 92,
    source: "CENTCOM",
  },
  {
    id: "bahrain",
    nameEn: "Bahrain (US 5th Fleet HQ)",
    nameHe: "בחריין (מפקדת הצי ה-5 של ארה\"ב)",
    percent: 8,
    estimatedProjectiles: 360,
    interceptRatePercent: 95,
    source: "CENTCOM / US Navy",
  },
  {
    id: "qatar",
    nameEn: "Qatar (Al Udeid Air Base)",
    nameHe: "קטאר (בסיס אל-עודייד)",
    percent: 6.2,
    estimatedProjectiles: 279,
    interceptRatePercent: 96,
    source: "CENTCOM",
  },
  {
    id: "iraq",
    nameEn: "Iraq (Ain al-Asad / Erbil)",
    nameHe: "עיראק (עין אל-אסד / ארביל)",
    percent: 7,
    estimatedProjectiles: 315,
    interceptRatePercent: 88,
    source: "CENTCOM / Reuters",
  },
  {
    id: "saudi",
    nameEn: "Saudi Arabia (Aramco / US bases)",
    nameHe: "סעודיה (ארמקו / בסיסי ארה\"ב)",
    percent: 3,
    estimatedProjectiles: 135,
    interceptRatePercent: 91,
    source: "Saudi MoD / Reuters",
  },
];
