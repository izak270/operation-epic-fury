// Forecast: Days 11-30 — Iranian fire rate projection based on attrition analysis
// V3: Updated based on Deep Research findings (Mar 11, 2026)
// Sources: Deep Research analysis of TEL destruction rate, munitions depletion, shift to attrition strategy

import { DailyLaunch } from "./launchData";

export interface ForecastDay extends DailyLaunch {
  isForecast: true;
  confidencePct: number; // confidence level of forecast (%)
  usMunitionsSpentUSD?: number; // cumulative US spending
  iranBMStockRemaining?: number; // estimated remaining BM inventory
  israelArrowStockRemaining?: number; // estimated remaining Arrow interceptors
}

// V3 forecast — calibrated with Deep Research data:
// - Iran UAV fleet updated to 2,000 (higher Shahed production capacity)
// - USA budget $886B (increased munitions procurement)
// - Israel 241 combat aircraft (more sorties = faster TEL attrition)
export const forecastTimeline: ForecastDay[] = [
  {
    date: "2026-03-10", day: 11,
    ballistic: 32, uav: 35,
    interceptRate: 98, activeTELs: 116,
    eventEn: "Sporadic BM launches; Iran pivots to Shahed swarm production surge",
    eventHe: "שיגורי טילים ספורדיים; איראן עוברת לייצור מואץ של נחילי שאהד",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 85,
    usMunitionsSpentUSD: 1_800_000_000,
    iranBMStockRemaining: 850,
    israelArrowStockRemaining: 140,
  },
  {
    date: "2026-03-11", day: 12,
    ballistic: 28, uav: 55,
    interceptRate: 97, activeTELs: 113,
    eventEn: "UAV swarms double — 2,000-unit fleet enables sustained 50+/day output",
    eventHe: "נחילי כטב\"מים מוכפלים — צי 2,000 יחידות מאפשר תפוקה של 50+ ליום",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 82,
    usMunitionsSpentUSD: 2_100_000_000,
    iranBMStockRemaining: 820,
    israelArrowStockRemaining: 132,
  },
  {
    date: "2026-03-12", day: 13,
    ballistic: 22, uav: 65,
    interceptRate: 97, activeTELs: 110,
    eventEn: "Calculated BM salvos targeting Arrow interceptor economics ($3M/intercept)",
    eventHe: "מטחי טילים מחושבים למיצוי כלכלת מיירטי חץ ($3M ליירוט)",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 80,
    usMunitionsSpentUSD: 2_350_000_000,
    iranBMStockRemaining: 798,
    israelArrowStockRemaining: 125,
  },
  {
    date: "2026-03-14", day: 15,
    ballistic: 18, uav: 80,
    interceptRate: 96, activeTELs: 106,
    eventEn: "Missile math: 15-20 BMs/day drains Israeli interceptors at 3:1 cost ratio",
    eventHe: "מתמטיקת טילים: 15-20 טילים ביום מדלדלים מיירטים ביחס עלות 3:1",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 75,
    usMunitionsSpentUSD: 2_800_000_000,
    iranBMStockRemaining: 760,
    israelArrowStockRemaining: 110,
  },
  {
    date: "2026-03-17", day: 18,
    ballistic: 12, uav: 95,
    interceptRate: 95, activeTELs: 100,
    eventEn: "TEL production bottleneck: 5-8 new/month vs 200+ destroyed; UAVs dominate",
    eventHe: "צוואר בקבוק משגרים: 5-8 חדשים/חודש מול 200+ שהושמדו; כטב\"מים שולטים",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 70,
    usMunitionsSpentUSD: 3_200_000_000,
    iranBMStockRemaining: 720,
    israelArrowStockRemaining: 95,
  },
  {
    date: "2026-03-20", day: 21,
    ballistic: 8, uav: 110,
    interceptRate: 94, activeTELs: 94,
    eventEn: "Iran shifts to UAV-dominant attrition; BMs reserved for high-value salvos only",
    eventHe: "איראן עוברת להתשה בדגש כטב\"מים; טילים בליסטיים שמורים למטחי ערך בלבד",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 65,
    usMunitionsSpentUSD: 3_600_000_000,
    iranBMStockRemaining: 695,
    israelArrowStockRemaining: 82,
  },
  {
    date: "2026-03-24", day: 25,
    ballistic: 5, uav: 120,
    interceptRate: 93, activeTELs: 88,
    eventEn: "Single-digit BMs; Iron Dome overwhelm attempts with 100+ daily UAVs ($20K each)",
    eventHe: "טילים בספרה בודדת; ניסיונות הצפה של כיפת ברזל עם 100+ כטב\"מים ($20K כל אחד)",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 58,
    usMunitionsSpentUSD: 4_000_000_000,
    iranBMStockRemaining: 675,
    israelArrowStockRemaining: 72,
  },
  {
    date: "2026-03-29", day: 30,
    ballistic: 3, uav: 130,
    interceptRate: 92, activeTELs: 82,
    eventEn: "Sustained attrition: ~3 BMs/day + 130 UAVs; defense economics unsustainable",
    eventHe: "התשה מתמשכת: ~3 טילים/יום + 130 כטב\"מים; כלכלת הגנה לא בת-קיימא",
    source: "Deep Research Forecast V3",
    isForecast: true, confidencePct: 52,
    usMunitionsSpentUSD: 4_500_000_000,
    iranBMStockRemaining: 660,
    israelArrowStockRemaining: 62,
  },
];
