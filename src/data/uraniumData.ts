// Iran uranium enrichment milestones
// Sources: IAEA reports, SIPRI, FAS Nuclear Notebook

export interface UraniumMilestone {
  date: string;
  levelPercent: number;   // enrichment level
  quantityKg: number;     // stockpile at that level
  totalStockpileKg: number; // total enriched uranium stockpile
  iaeaStatus: "full_access" | "limited_access" | "no_access";
  eventEn: string;
  eventHe: string;
  source: string;
}

export const uraniumTimeline: UraniumMilestone[] = [
  {
    date: "2020-01-01", levelPercent: 5, quantityKg: 1020,
    totalStockpileKg: 1020,
    iaeaStatus: "full_access",
    eventEn: "Post-JCPOA withdrawal — enrichment resumes at 5%",
    eventHe: "לאחר פרישה מהסכם — העשרה מתחדשת ב-5%",
    source: "IAEA GOV/2020/5",
  },
  {
    date: "2021-01-01", levelPercent: 20, quantityKg: 17.6,
    totalStockpileKg: 2443,
    iaeaStatus: "full_access",
    eventEn: "Iran begins 20% enrichment at Fordow underground facility",
    eventHe: "איראן מתחילה העשרה ל-20% במתקן התת-קרקעי פורדו",
    source: "IAEA GOV/2021/10",
  },
  {
    date: "2021-04-01", levelPercent: 60, quantityKg: 2.4,
    totalStockpileKg: 3241,
    iaeaStatus: "limited_access",
    eventEn: "First enrichment to 60% — near weapons-grade (90%)",
    eventHe: "העשרה ראשונה ל-60% — קרוב לדרגה צבאית (90%)",
    source: "IAEA GOV/2021/29",
  },
  {
    date: "2023-06-01", levelPercent: 60, quantityKg: 128.3,
    totalStockpileKg: 5525,
    iaeaStatus: "limited_access",
    eventEn: "60% stockpile grows to 128.3 kg; IAEA cameras removed from key sites",
    eventHe: "מלאי 60% גדל ל-128.3 ק\"ג; מצלמות סבא\"א הוסרו מאתרים מרכזיים",
    source: "IAEA GOV/2023/26",
  },
  {
    date: "2024-05-01", levelPercent: 60, quantityKg: 313.4,
    totalStockpileKg: 7539,
    iaeaStatus: "limited_access",
    eventEn: "Rapid growth of 60% stockpile; enough for ~5 weapons if enriched to 90%",
    eventHe: "צמיחה מהירה של מלאי 60%; מספיק ל-~5 נשקים אם יועשר ל-90%",
    source: "IAEA GOV/2024/18",
  },
  {
    date: "2025-05-01", levelPercent: 60, quantityKg: 440,
    totalStockpileKg: 9247.6,
    iaeaStatus: "limited_access",
    eventEn: "440 kg at 60% — breakout time estimated at 1-2 weeks",
    eventHe: "440 ק\"ג ב-60% — זמן פריצה מוערך בשבוע עד שבועיים",
    source: "IAEA GOV/2025/12 / FAS",
  },
  {
    date: "2026-02-01", levelPercent: 60, quantityKg: 440,
    totalStockpileKg: 9247.6,
    iaeaStatus: "no_access",
    eventEn: "IAEA 'continuity of knowledge' severed; cameras removed, sites concealed",
    eventHe: "\"רצף הידיעה\" של סבא\"א נותק; מצלמות הוסרו, אתרים הוסתרו",
    source: "IAEA DG report / Reuters Feb 2026",
  },
];

// Enrichment levels for chart visualization
export const enrichmentLevels = [
  { level: 5, labelEn: "Low Enriched (5%)", labelHe: "העשרה נמוכה (5%)", color: "hsl(var(--muted-foreground))" },
  { level: 20, labelEn: "Medium Enriched (20%)", labelHe: "העשרה בינונית (20%)", color: "hsl(210, 70%, 50%)" },
  { level: 60, labelEn: "Near Weapons-Grade (60%)", labelHe: "קרוב לדרגה צבאית (60%)", color: "hsl(var(--loss))" },
  { level: 90, labelEn: "Weapons-Grade (90%)", labelHe: "דרגה צבאית (90%)", color: "hsl(0, 80%, 40%)" },
];
