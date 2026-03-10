import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { launchTimeline } from "@/data/launchData";

// 4D: X=day, Y=total fire, size=TELs remaining, color=intercept rate
const CapabilityErosionChart: React.FC = () => {
  const { lang } = useLanguage();

  const data = launchTimeline.map(d => ({
    day: d.day,
    totalFire: d.ballistic + d.uav,
    tels: d.activeTELs,
    interceptRate: d.interceptRate,
    label: `${lang === "he" ? "יום" : "Day"} ${d.day}`,
    event: lang === "he" ? d.eventHe : d.eventEn,
  }));

  const getColor = (rate: number) => {
    // Green (high intercept) to red (low intercept)
    const hue = ((rate - 85) / 15) * 120; // 85%→0(red), 100%→120(green)
    return `hsl(${Math.max(0, Math.min(120, hue))}, 70%, 45%)`;
  };

  return (
    <div className="w-full h-[340px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
          <XAxis
            type="number" dataKey="day" name={lang === "he" ? "יום" : "Day"}
            stroke="hsl(0,0%,55%)" fontSize={11}
            domain={[0, 11]} ticks={[1,2,3,4,5,6,7,8,9,10]}
          />
          <YAxis
            type="number" dataKey="totalFire"
            name={lang === "he" ? "נפח אש" : "Fire Volume"}
            stroke="hsl(0,0%,55%)" fontSize={11}
          />
          <ZAxis type="number" dataKey="tels" range={[200, 1200]} name="TELs" />
          <Tooltip
            contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
            labelStyle={{ color: "hsl(0,0%,91%)" }}
            formatter={(val: number, name: string) => {
              if (name === "TELs") return [val, lang === "he" ? "משגרים פעילים" : "Active Launchers"];
              if (name === (lang === "he" ? "נפח אש" : "Fire Volume")) return [val.toLocaleString(), name];
              return [val, name];
            }}
            labelFormatter={(val) => `${lang === "he" ? "יום" : "Day"} ${val}`}
          />
          <Scatter data={data}>
            {data.map((d, i) => (
              <Cell key={i} fill={getColor(d.interceptRate)} fillOpacity={0.85} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground font-frank">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0, 70%, 45%)" }} />
          {lang === "he" ? "יירוט נמוך" : "Low Intercept"}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(60, 70%, 45%)" }} />
          {lang === "he" ? "בינוני" : "Medium"}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(120, 70%, 45%)" }} />
          {lang === "he" ? "יירוט גבוה" : "High Intercept"}
        </div>
        <div className="flex items-center gap-1 ms-2">
          <div className="w-3 h-3 rounded-full border border-muted-foreground" />
          <span>= {lang === "he" ? "גודל = משגרים כשירים" : "Size = Active TELs"}</span>
        </div>
      </div>
    </div>
  );
};

export default CapabilityErosionChart;
