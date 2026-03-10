import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { uraniumTimeline, enrichmentLevels } from "@/data/uraniumData";

const UraniumStatusChart: React.FC = () => {
  const { lang } = useLanguage();

  // Get the latest milestone for each enrichment level
  const latestData = uraniumTimeline[uraniumTimeline.length - 1];
  
  // Build stacked data from the timeline — show growth of 60% stockpile over time
  const data = uraniumTimeline
    .filter(m => m.levelPercent === 60)
    .map(m => ({
      date: m.date.slice(0, 7),
      qty60: m.quantityKg,
      total: m.totalStockpileKg,
      event: lang === "he" ? m.eventHe : m.eventEn,
      iaea: m.iaeaStatus,
    }));

  const getBarColor = (iaea: string) => {
    if (iaea === "no_access") return "hsl(0, 60%, 45%)";
    if (iaea === "limited_access") return "hsl(30, 80%, 50%)";
    return "hsl(0, 0%, 55%)";
  };

  const iaeaLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      full_access: { en: "IAEA: Full Access", he: "סבא\"א: גישה מלאה" },
      limited_access: { en: "IAEA: Limited", he: "סבא\"א: גישה מוגבלת" },
      no_access: { en: "IAEA: No Access", he: "סבא\"א: ללא גישה" },
    };
    return labels[status]?.[lang] || status;
  };

  return (
    <div className="w-full">
      <div className="h-[300px]" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
            <XAxis dataKey="date" stroke="hsl(0,0%,55%)" fontSize={10} />
            <YAxis
              stroke="hsl(0,0%,55%)" fontSize={11}
              label={{
                value: lang === "he" ? "ק\"ג (60%)" : "kg (60%)",
                angle: -90, position: "insideLeft",
                style: { fill: "hsl(0,0%,55%)", fontSize: 10 }
              }}
            />
            <Tooltip
              contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
              labelStyle={{ color: "hsl(0,0%,91%)" }}
              formatter={(val: number, name: string, props: any) => {
                const entry = props.payload;
                return [
                  `${val.toLocaleString()} kg — ${iaeaLabel(entry.iaea)}`,
                  lang === "he" ? "אורניום 60%" : "Uranium 60%"
                ];
              }}
            />
            <Bar dataKey="qty60" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={getBarColor(d.iaea)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground font-frank">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0,0%,55%)" }} />
          {lang === "he" ? "גישה מלאה" : "Full Access"}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(30, 80%, 50%)" }} />
          {lang === "he" ? "גישה מוגבלת" : "Limited"}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0, 60%, 45%)" }} />
          {lang === "he" ? "ללא גישה" : "No Access"}
        </div>
      </div>
    </div>
  );
};

export default UraniumStatusChart;
