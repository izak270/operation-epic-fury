// Forecast: Days 11-30 — Iranian fire rate projection based on attrition analysis
// Based on: TEL destruction rate, munitions depletion, shift to attrition strategy

import { DailyLaunch } from "./launchData";

export interface ForecastDay extends DailyLaunch {
  isForecast: true;
  confidencePct: number; // confidence level of forecast (%)
}

export const forecastTimeline: ForecastDay[] = [
  {
    date: "2026-03-10", day: 11,
    ballistic: 35, uav: 25,
    interceptRate: 98, activeTELs: 118,
    eventEn: "Sporadic launches; Iran conserves ballistic stock for attrition",
    eventHe: "שיגורים ספורדיים; איראן משמרת מלאי בליסטי להתשה",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 85,
  },
  {
    date: "2026-03-11", day: 12,
    ballistic: 30, uav: 40,
    interceptRate: 98, activeTELs: 115,
    eventEn: "UAV swarms increase — cheap attrition of Gulf air defenses",
    eventHe: "עלייה בנחילי כטב\"מים — התשת הגנות אוויר במפרץ בזול",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 82,
  },
  {
    date: "2026-03-12", day: 13,
    ballistic: 25, uav: 50,
    interceptRate: 97, activeTELs: 113,
    eventEn: "Small calculated salvos targeting Israeli Arrow interceptor stocks",
    eventHe: "מטחים קטנים ומחושבים לשחיקת מלאי מיירטי חץ",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 80,
  },
  {
    date: "2026-03-14", day: 15,
    ballistic: 20, uav: 60,
    interceptRate: 97, activeTELs: 110,
    eventEn: "Missile math strategy: 15-25 BMs/day to drain Israeli interceptors",
    eventHe: "אסטרטגיית מתמטיקת טילים: 15-25 טילים ביום לדלדול מיירטים",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 75,
  },
  {
    date: "2026-03-17", day: 18,
    ballistic: 15, uav: 70,
    interceptRate: 96, activeTELs: 105,
    eventEn: "Production bottleneck: est. 5-8 new TELs/month vs 180+ destroyed",
    eventHe: "צוואר בקבוק ייצור: הערכה 5-8 משגרים חדשים/חודש מול 180+ שהושמדו",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 70,
  },
  {
    date: "2026-03-20", day: 21,
    ballistic: 12, uav: 80,
    interceptRate: 95, activeTELs: 100,
    eventEn: "Shift to UAV-dominant strategy; BMs reserved for high-value targets",
    eventHe: "מעבר לאסטרטגיית כטב\"מים; טילים בליסטיים שמורים למטרות ערך גבוה",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 65,
  },
  {
    date: "2026-03-24", day: 25,
    ballistic: 8, uav: 90,
    interceptRate: 94, activeTELs: 95,
    eventEn: "Single-digit daily BM launches; interceptor economics favor Iran",
    eventHe: "שיגורי טילים בליסטיים בספרה בודדת ביום; כלכלת מיירטים לטובת איראן",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 60,
  },
  {
    date: "2026-03-29", day: 30,
    ballistic: 5, uav: 100,
    interceptRate: 93, activeTELs: 90,
    eventEn: "Sustained attrition phase: ~5 BMs/day + 100 UAVs to exhaust defenses",
    eventHe: "שלב התשה מתמשך: ~5 טילים/יום + 100 כטב\"מים לשחיקת הגנות",
    source: "Forecast — AIO analysis",
    isForecast: true, confidencePct: 55,
  },
];
