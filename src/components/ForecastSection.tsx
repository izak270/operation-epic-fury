import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, ComposedChart, Bar, Line, ScatterChart, Scatter, ZAxis, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import SourceLink from "./SourceLink";
import { launchTimeline } from "@/data/launchData";
import { forecastTimeline } from "@/data/forecastData";

const ForecastSection: React.FC = () => {
  const { t, lang } = useLanguage();

  // ── Chart 1: Fire Rate Collapse + Forecast ──
  const fireRateData = [
    ...launchTimeline.map(d => ({
      day: d.day,
      label: `${lang === "he" ? "יום" : "D"}${d.day}`,
      ballistic: d.ballistic,
      forecast: null as number | null,
      event: lang === "he" ? d.eventHe : d.eventEn,
    })),
    // bridge point
    {
      day: 10,
      label: `${lang === "he" ? "יום" : "D"}10`,
      ballistic: null as number | null,
      forecast: 40,
      event: "",
    },
    ...forecastTimeline.map(d => ({
      day: d.day,
      label: `${lang === "he" ? "יום" : "D"}${d.day}`,
      ballistic: null as number | null,
      forecast: d.ballistic,
      event: lang === "he" ? d.eventHe : d.eventEn,
    })),
  ];

  // ── Chart 2: UAV vs BM shift ──
  const shiftData = [
    ...launchTimeline.map(d => ({
      day: d.day,
      label: `${lang === "he" ? "יום" : "D"}${d.day}`,
      ballistic: d.ballistic,
      uav: d.uav,
      isForecast: false,
    })),
    ...forecastTimeline.map(d => ({
      day: d.day,
      label: `${lang === "he" ? "יום" : "D"}${d.day}`,
      ballistic: d.ballistic,
      uav: d.uav,
      isForecast: true,
    })),
  ];

  // ── Chart 3: TEL + Intercept erosion ──
  const erosionData = [
    ...launchTimeline.map(d => ({
      day: d.day,
      label: `${lang === "he" ? "יום" : "D"}${d.day}`,
      tels: d.activeTELs,
      interceptRate: d.interceptRate,
      totalFire: d.ballistic + d.uav,
      isForecast: false,
    })),
    ...forecastTimeline.map(d => ({
      day: d.day,
      label: `${lang === "he" ? "יום" : "D"}${d.day}`,
      tels: d.activeTELs,
      interceptRate: d.interceptRate,
      totalFire: d.ballistic + d.uav,
      isForecast: true,
    })),
  ];

  const chartCard = (title: string, subtitle: string, source: string, children: React.ReactNode, index: number) => (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 transition-colors hover:border-primary/20">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-heebo font-bold text-sm sm:text-base text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-frank mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[9px] font-heebo font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex-shrink-0 border border-amber-400/20">
          {lang === "he" ? "תחזית" : "FORECAST"}
        </span>
      </div>
      {children}
      <p className="text-[10px] text-muted-foreground font-frank mt-3 pt-2 border-t border-border">
        {t("label.source")}: <SourceLink text={source} />
      </p>
    </div>
  );

  const tooltipStyle = {
    background: "hsl(0,0%,10%)",
    border: "1px solid hsl(0,0%,18%)",
    borderRadius: 6,
    fontSize: 12,
  };

  return (
    <section className="px-4 sm:px-8 py-8 space-y-5">
      {/* Section header */}
      <div className="pb-3 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-amber-400" />
          <h2 className="font-heebo font-black text-lg sm:text-xl">
            {t("forecast.section.title")}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-frank mt-1 ltr:ml-3 rtl:mr-3">
          {t("forecast.section.subtitle")}
        </p>
      </div>

      {/* Analysis summary */}
      <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-400 text-lg">⚠️</span>
          <h3 className="font-heebo font-bold text-sm text-amber-400">
            {lang === "he" ? "סיכום תחזית" : "Forecast Summary"}
          </h3>
        </div>
        <div className="space-y-2 text-xs font-frank text-muted-foreground leading-relaxed">
          <p>{t("forecast.summary.fireRate")}</p>
          <p>{t("forecast.summary.tels")}</p>
          <p>{t("forecast.summary.strategy")}</p>
          <p className="font-heebo font-bold text-foreground pt-1">{t("forecast.summary.conclusion")}</p>
        </div>
      </div>

      {/* Chart 1: Fire Rate with Forecast */}
      {chartCard(
        t("forecast.chart.fireRate.title"),
        t("forecast.chart.fireRate.subtitle"),
        t("forecast.chart.fireRate.source"),
        <div className="w-full h-[300px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fireRateData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="fireGradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 40%, 48%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(0, 40%, 48%)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fireGradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 90%, 50%)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="hsl(45, 90%, 50%)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
              <XAxis dataKey="label" stroke="hsl(0,0%,55%)" fontSize={10} />
              <YAxis stroke="hsl(0,0%,55%)" fontSize={11} />
              <ReferenceLine x={`${lang === "he" ? "יום" : "D"}10`} stroke="hsl(45, 90%, 50%)" strokeDasharray="5 5" strokeWidth={1} label={{ value: lang === "he" ? "תחזית →" : "Forecast →", position: "top", fill: "hsl(45, 90%, 50%)", fontSize: 10 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "hsl(0,0%,91%)" }}
                formatter={(val: number, name: string) => {
                  if (!val) return [null, null];
                  const label = name === "ballistic" 
                    ? (lang === "he" ? "בליסטי (נתון)" : "Ballistic (actual)") 
                    : (lang === "he" ? "בליסטי (תחזית)" : "Ballistic (forecast)");
                  return [val.toLocaleString(), label];
                }}
              />
              <Area type="monotone" dataKey="ballistic" stroke="hsl(0, 40%, 48%)" strokeWidth={2} fill="url(#fireGradActual)" connectNulls={false} />
              <Area type="monotone" dataKey="forecast" stroke="hsl(45, 90%, 50%)" strokeWidth={2} strokeDasharray="6 3" fill="url(#fireGradForecast)" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-1 text-[10px] text-muted-foreground font-frank">
            <div className="flex items-center gap-1">
              <div className="w-4 h-[2px] rounded" style={{ background: "hsl(0, 40%, 48%)" }} />
              {lang === "he" ? "נתון בפועל" : "Actual"}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-[2px] rounded" style={{ background: "hsl(45, 90%, 50%)", borderTop: "1px dashed hsl(45, 90%, 50%)" }} />
              {lang === "he" ? "תחזית" : "Forecast"}
            </div>
          </div>
        </div>,
        1
      )}

      {/* Chart 2: BM vs UAV shift */}
      {chartCard(
        t("forecast.chart.shift.title"),
        t("forecast.chart.shift.subtitle"),
        t("forecast.chart.shift.source"),
        <div className="w-full h-[300px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={shiftData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
              <XAxis dataKey="label" stroke="hsl(0,0%,55%)" fontSize={10} />
              <YAxis stroke="hsl(0,0%,55%)" fontSize={11} />
              <ReferenceLine x={`${lang === "he" ? "יום" : "D"}10`} stroke="hsl(0,0%,30%)" strokeDasharray="5 5" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "hsl(0,0%,91%)" }} />
              <Bar dataKey="ballistic" name={lang === "he" ? "טילים בליסטיים" : "Ballistic Missiles"} fill="hsl(0, 40%, 48%)" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="uav" name={lang === "he" ? "כטב\"מים" : "UAVs"} stroke="hsl(200, 70%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-1 text-[10px] text-muted-foreground font-frank">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(0, 40%, 48%)", opacity: 0.7 }} />
              {lang === "he" ? "טילים בליסטיים" : "Ballistic"}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-[2px] rounded" style={{ background: "hsl(200, 70%, 50%)" }} />
              {lang === "he" ? "כטב\"מים" : "UAVs"}
            </div>
          </div>
        </div>,
        2
      )}

      {/* Chart 3: TEL erosion + intercept rate */}
      {chartCard(
        t("forecast.chart.erosion.title"),
        t("forecast.chart.erosion.subtitle"),
        t("forecast.chart.erosion.source"),
        <div className="w-full h-[300px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={erosionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
              <XAxis dataKey="label" stroke="hsl(0,0%,55%)" fontSize={10} />
              <YAxis yAxisId="left" stroke="hsl(0,0%,55%)" fontSize={11} label={{ value: "TELs", angle: -90, position: "insideLeft", fill: "hsl(0,0%,55%)", fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={[80, 100]} stroke="hsl(0,0%,55%)" fontSize={11} label={{ value: "%", angle: 90, position: "insideRight", fill: "hsl(0,0%,55%)", fontSize: 10 }} />
              <ReferenceLine yAxisId="left" x={`${lang === "he" ? "יום" : "D"}10`} stroke="hsl(0,0%,30%)" strokeDasharray="5 5" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "hsl(0,0%,91%)" }} />
              <Bar yAxisId="left" dataKey="tels" name={lang === "he" ? "משגרים פעילים" : "Active TELs"} fill="hsl(30, 60%, 45%)" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="interceptRate" name={lang === "he" ? "אחוז יירוט" : "Intercept %"} stroke="hsl(150, 60%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-1 text-[10px] text-muted-foreground font-frank">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(30, 60%, 45%)", opacity: 0.6 }} />
              {lang === "he" ? "משגרים (TEL)" : "TELs"}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-[2px] rounded" style={{ background: "hsl(150, 60%, 45%)" }} />
              {lang === "he" ? "אחוז יירוט" : "Intercept %"}
            </div>
          </div>
        </div>,
        3
      )}
    </section>
  );
};

export default ForecastSection;
