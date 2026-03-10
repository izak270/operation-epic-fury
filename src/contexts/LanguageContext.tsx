import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "he";

interface LanguageContextType {
  lang: Language;
  toggle: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Language, string>> = {
  "app.title": { en: "Force Posture", he: "מצבת כוחות" },
  "app.subtitle": { en: "USA · Israel · Iran", he: "ארה״ב · ישראל · איראן" },
  "country.usa": { en: "USA", he: "ארה״ב" },
  "country.israel": { en: "Israel", he: "ישראל" },
  "country.iran": { en: "Iran", he: "איראן" },
  "cat.active": { en: "Active Military Personnel", he: "אנשי צבא בשירות פעיל" },
  "cat.reserve": { en: "Reserve Personnel", he: "כוח מילואים" },
  "cat.aircraft": { en: "Fighter / Attack Aircraft", he: "מטוסי קרב / תקיפה" },
  "cat.tanks": { en: "Tanks (MBTs)", he: 'טנקים (קרב ראשי)' },
  "cat.naval": { en: "Naval Vessels", he: "כלי שיט צבאיים" },
  "cat.missiles": { en: "Missile Systems", he: "מערכות טילים" },
  "cat.budget": { en: "Defense Budget (USD)", he: "תקציב ביטחון (דולר)" },
  "cat.nuclear": { en: "Nuclear Warheads", he: "ראשי נפץ גרעיניים" },
  "cat.mil_kia": { en: "Security Forces Killed (KIA)", he: "הרוגי כוחות ביטחון" },
  "cat.civ_killed": { en: "Civilians Killed (Own)", he: "אזרחים שנהרגו (מדינה)" },
  "cat.civ_killed_other": { en: "Conflict Civilian Toll", he: "אזרחים שנהרגו בסכסוך" },
  "cat.gaza_killed": { en: "Gaza — 72,000+ killed", he: "עזה — 72,000+ הרוגים" },
  "cat.lebanon_killed": { en: "Lebanon — 3,000+ killed", he: "לבנון — 3,000+ הרוגים" },
  "label.source": { en: "Source", he: "מקור" },
  "label.change": { en: "Change", he: "שינוי" },
  "label.na": { en: "N/A", he: "לא רלוונטי" },
  "label.est": { en: "est.", he: "הערכה" },
  "lang.toggle": { en: "עברית", he: "English" },
  "version.v0": { en: "v0 — Baseline 2024", he: "v0 — בסיס 2024" },
  "version.v1": { en: "v1 — March 2026", he: "v1 — מרץ 2026" },
  "version.label": { en: "Version", he: "גרסה" },
  "footer.disclaimer": { 
    en: "Data based on publicly available estimates. Sources: GlobalFirepower 2026, IISS, SIPRI, IDF official data, JPost.", 
    he: "הנתונים מבוססים על הערכות פומביות. מקורות: GlobalFirepower 2026, IISS, SIPRI, נתוני צה״ל, JPost." 
  },
  "note.since_oct_2023": { en: "since Oct 2023", he: "מאז אוקטובר 2023" },
  "note.inc_oct7": { en: "inc. Oct 7", he: "כולל 7 באוקטובר" },
  "note.iran_claim": { en: "Iran claim", he: "לפי איראן" },

  // Navigation tabs
  "nav.data": { en: "Data", he: "נתונים" },
  "nav.charts": { en: "Charts", he: "גרפים" },

  // Charts section
  "charts.section.title": { en: "Intelligence Charts", he: "גרפים מודיעיניים" },
  "charts.section.subtitle": { en: "Visual analysis of force posture, munitions, and conflict trends", he: "ניתוח חזותי של מצבת כוחות, חימושים ומגמות סכסוך" },

  // Chart 1 — Personnel
  "chart.personnel.title": { en: "Military Personnel Comparison", he: "השוואת כוח אדם צבאי" },
  "chart.personnel.subtitle": { en: "Active vs Reserve forces — March 2026", he: "כוח סדיר מול מילואים — מרץ 2026" },
  "chart.personnel.source": { en: "GlobalFirepower 2026 / IDF", he: "GlobalFirepower 2026 / צה\"ל" },

  // Chart 2 — Fire Rate Collapse
  "chart.fireRate.title": { en: "Iranian Fire Rate Collapse", he: "קריסת קצב האש האיראני" },
  "chart.fireRate.subtitle": { en: "Daily ballistic missile launches — Days 1-10", he: "שיגורי טילים בליסטיים יומיים — ימים 1-10" },
  "chart.fireRate.source": { en: "CENTCOM / IDF / CSIS", he: "CENTCOM / צה\"ל / CSIS" },

  // Chart 3 — Dual Launch
  "chart.dualLaunch.title": { en: "Ballistic Missiles vs UAVs", he: "טילים בליסטיים מול כטב\"מים" },
  "chart.dualLaunch.subtitle": { en: "Dual-axis comparison of Iranian launch types", he: "השוואה דו-צירית של סוגי שיגורים איראניים" },
  "chart.dualLaunch.source": { en: "CENTCOM / IDF Spokesperson", he: "CENTCOM / דובר צה\"ל" },

  // Chart 4 — Cost Comparison
  "chart.cost.title": { en: "Attack vs Defense Cost Equation", he: "משוואת עלויות: תקיפה מול הגנה" },
  "chart.cost.subtitle": { en: "Cost per Iranian missile vs interceptor (log scale)", he: "עלות טיל איראני מול מיירט (סקאלה לוגריתמית)" },
  "chart.cost.source": { en: "CSIS / Rafael / MDA / Raytheon", he: "CSIS / רפאל / MDA / ריית'און" },

  // Chart 5 — Target Distribution
  "chart.target.title": { en: "Geographic Fire Distribution", he: "פיזור גיאוגרפי של אש איראנית" },
  "chart.target.subtitle": { en: "% of Iranian projectiles by target country", he: "% קליעים איראניים לפי מדינת יעד" },
  "chart.target.source": { en: "CENTCOM / Gulf MoDs / IDF", he: "CENTCOM / משרדי ביטחון מפרצי / צה\"ל" },

  // Chart 6 — Capability Erosion (4D)
  "chart.erosion.title": { en: "Capability Erosion — 4D Analysis", he: "שחיקת יכולות — ניתוח 4 מימדים" },
  "chart.erosion.subtitle": { en: "Time × Fire Volume × Active TELs × Intercept Rate", he: "זמן × נפח אש × משגרים כשירים × אחוז יירוט" },
  "chart.erosion.source": { en: "CENTCOM / IDF / CSIS satellite analysis", he: "CENTCOM / צה\"ל / ניתוח לווייני CSIS" },

  // Chart 7 — US Munitions Treemap
  "chart.usMunitions.title": { en: "US Munitions Spending — First 100 Hours", he: "הוצאות חימושים אמריקאיות — 100 שעות ראשונות" },
  "chart.usMunitions.subtitle": { en: "Breakdown by type: offensive vs defensive", he: "חלוקה לפי סוג: התקפי מול הגנתי" },
  "chart.usMunitions.source": { en: "CENTCOM / US Navy / USAF", he: "CENTCOM / חיל הים / חיל האוויר האמריקאי" },

  // Chart 8 — Uranium Status
  "chart.uranium.title": { en: "Iran Uranium Enrichment — 60% Stockpile", he: "העשרת אורניום איראנית — מלאי 60%" },
  "chart.uranium.subtitle": { en: "Growth of near-weapons-grade material (kg) + IAEA access status", he: "צמיחת חומר קרוב לדרגה צבאית (ק\"ג) + סטטוס גישת סבא\"א" },
  "chart.uranium.source": { en: "IAEA reports / FAS / SIPRI", he: "דוחות סבא\"א / FAS / SIPRI" },

  // Chart 9 — Missile Range Radar
  "chart.missileRadar.title": { en: "Iranian Missile Arsenal — Range & Warhead", he: "ארסנל הטילים האיראני — טווח וראש קרב" },
  "chart.missileRadar.subtitle": { en: "Radar view: range (km) and warhead weight (kg)", he: "תצוגת רדאר: טווח (ק\"מ) ומשקל ראש קרב (ק\"ג)" },
  "chart.missileRadar.source": { en: "CSIS Missile Defense Project / IISS", he: "פרויקט הגנת טילים CSIS / IISS" },

  // Chart 10 — Casualty Breakdown
  "chart.casualty.title": { en: "Iran Casualties — Military vs Civilian", he: "הרוגים באיראן — צבאי מול אזרחי" },
  "chart.casualty.subtitle": { en: "Breakdown of Iranian fatalities from coalition strikes", he: "פילוח הרוגים איראנים מתקיפות הקואליציה" },
  "chart.casualty.source": { en: "MoH / Reuters / Al Jazeera Mar 2026", he: "משרד הבריאות / רויטרס / אל-ג'זירה מרץ 2026" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("force-lang") as Language) || "he";
  });

  useEffect(() => {
    localStorage.setItem("force-lang", lang);
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang((l) => (l === "en" ? "he" : "en"));

  const t = (key: string) => translations[key]?.[lang] || key;

  const dir = lang === "he" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
};
