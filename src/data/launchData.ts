// Daily Iranian launch timeline — "Operation Wrath" (Feb 28 – Mar 9, 2026)
// Sources: CENTCOM briefings, IDF Spokesperson, CSIS Missile Defense Project, JPost

export interface DailyLaunch {
  date: string;         // ISO date
  day: number;          // combat day (1-10)
  ballistic: number;    // ballistic missiles launched
  uav: number;          // UAVs/drones launched
  interceptRate: number; // % intercepted by coalition (est.)
  activeTELs: number;   // remaining operational TEL launchers (est.)
  eventEn: string;
  eventHe: string;
  source: string;
}

export const launchTimeline: DailyLaunch[] = [
  {
    date: "2026-02-28", day: 1,
    ballistic: 480, uav: 720,
    interceptRate: 87, activeTELs: 300,
    eventEn: "Combined US-Israel opening strike; Iran retaliates with massive salvo",
    eventHe: "מתקפה משולבת אמריקאית-ישראלית; איראן משיבה בצרור מסיבי",
    source: "CENTCOM / IDF Spokesperson",
  },
  {
    date: "2026-03-01", day: 2,
    ballistic: 520, uav: 850,
    interceptRate: 85, activeTELs: 270,
    eventEn: "Peak Iranian fire rate — largest single-day ballistic barrage in history",
    eventHe: "שיא קצב אש איראני — המטח הבליסטי הגדול ביותר ביום אחד בהיסטוריה",
    source: "CSIS Missile Defense Project",
  },
  {
    date: "2026-03-02", day: 3,
    ballistic: 400, uav: 530,
    interceptRate: 89, activeTELs: 220,
    eventEn: "Hezbollah joins with rocket barrages from Lebanon; TEL attrition begins",
    eventHe: "חיזבאללה מצטרף בירי רקטות מלבנון; תחילת שחיקת משגרים",
    source: "IDF / Reuters",
  },
  {
    date: "2026-03-03", day: 4,
    ballistic: 350, uav: 480,
    interceptRate: 91, activeTELs: 190,
    eventEn: "Coalition strikes on IRGC missile depots in Isfahan and Shiraz",
    eventHe: "תקיפות קואליציה על מחסני טילים של משמרות המהפכה באיספהאן ושיראז",
    source: "CENTCOM briefing",
  },
  {
    date: "2026-03-04", day: 5,
    ballistic: 250, uav: 350,
    interceptRate: 92, activeTELs: 160,
    eventEn: "50%+ drop from peak; US Navy interceptor stocks running low in Red Sea",
    eventHe: "ירידה של 50%+ מהשיא; מלאי מיירטים של חיל הים האמריקאי בים סוף אוזל",
    source: "CENTCOM / JPost",
  },
  {
    date: "2026-03-05", day: 6,
    ballistic: 150, uav: 200,
    interceptRate: 94, activeTELs: 140,
    eventEn: "CENTCOM reports 90% decline in launch rate vs Day 1",
    eventHe: "פיקוד המרכז מדווח על ירידה של 90% בקצב השיגורים לעומת יום 1",
    source: "CENTCOM press release",
  },
  {
    date: "2026-03-06", day: 7,
    ballistic: 100, uav: 140,
    interceptRate: 95, activeTELs: 130,
    eventEn: "Combined strikes on oil infrastructure and IRGC command centers",
    eventHe: "תקיפות משולבות על תשתיות נפט ומפקדות משמרות המהפכה",
    source: "IDF / CENTCOM",
  },
  {
    date: "2026-03-07", day: 8,
    ballistic: 70, uav: 90,
    interceptRate: 96, activeTELs: 125,
    eventEn: "Iran shifts to dispersed launches from hardened mountain tunnels",
    eventHe: "איראן עוברת לשיגורים מפוזרים ממנהרות הרים מבוצרות",
    source: "CSIS / satellite imagery analysis",
  },
  {
    date: "2026-03-08", day: 9,
    ballistic: 50, uav: 60,
    interceptRate: 97, activeTELs: 122,
    eventEn: "Ceasefire negotiations begin; fire rate at fraction of opening",
    eventHe: "משא ומתן להפסקת אש מתחיל; קצב אש בשבריר מיום הפתיחה",
    source: "Reuters / Al Jazeera",
  },
  {
    date: "2026-03-09", day: 10,
    ballistic: 40, uav: 30,
    interceptRate: 98, activeTELs: 120,
    eventEn: "92% drop from peak; est. 120 operational launchers remain",
    eventHe: "צניחה של 92% מהשיא; הערכה: 120 משגרים פעילים נותרו",
    source: "CENTCOM / IDF assessment",
  },
];
