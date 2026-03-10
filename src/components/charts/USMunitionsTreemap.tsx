import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { usMunitionsSpending, totalUSSpending100Hours } from "@/data/costData";

const USMunitionsTreemap: React.FC = () => {
  const { lang } = useLanguage();

  const formatUSD = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(0)}M`;
    return `$${(val / 1_000).toFixed(0)}K`;
  };

  // Sort by cost descending
  const sorted = [...usMunitionsSpending].sort((a, b) => b.totalCostUSD - a.totalCostUSD);

  const data = sorted.map(m => ({
    name: lang === "he" ? m.nameHe : m.nameEn,
    cost: m.totalCostUSD,
    qty: m.quantity,
    unitCost: m.unitCostUSD,
    type: m.type,
    source: m.source,
  }));

  const getColor = (type: string) => type === "offensive" ? "hsl(0, 40%, 48%)" : "hsl(213, 80%, 45%)";

  return (
    <div className="w-full space-y-4">
      {/* Summary header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <div className="text-2xl font-heebo font-black text-foreground">
            {formatUSD(totalUSSpending100Hours)}
          </div>
          <div className="text-xs text-muted-foreground font-frank">
            {lang === "he" ? "סה\"כ הוצאות — 100 שעות ראשונות" : "Total spending — first 100 hours"}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: "hsl(0, 40%, 48%)" }} />
            <span className="text-[11px] font-heebo text-muted-foreground">
              {lang === "he" ? "התקפי" : "Offensive"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: "hsl(213, 80%, 45%)" }} />
            <span className="text-[11px] font-heebo text-muted-foreground">
              {lang === "he" ? "הגנתי (מיירטים)" : "Defensive (interceptors)"}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div className="h-[360px]" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 80, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" horizontal={false} />
            <XAxis
              type="number"
              stroke="hsl(0,0%,55%)"
              fontSize={10}
              tickFormatter={formatUSD}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(0,0%,55%)"
              fontSize={11}
              width={120}
              tick={{ fill: "hsl(0,0%,80%)" }}
            />
            <Tooltip
              contentStyle={{ background: "hsl(0,0%,8%)", border: "1px solid hsl(0,0%,20%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(0,0%,91%)", fontWeight: 700 }}
              formatter={(val: number) => [formatUSD(val), lang === "he" ? "עלות כוללת" : "Total Cost"]}
            />
            <Bar dataKey="cost" radius={[0, 6, 6, 0]} barSize={28}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.type)} />
              ))}
              <LabelList
                dataKey="cost"
                position="right"
                formatter={(val: number) => formatUSD(val)}
                style={{ fill: "hsl(0,0%,75%)", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sorted.map(m => (
          <div key={m.id} className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-lg border border-border/50">
            <div>
              <div className="text-xs font-heebo font-bold text-foreground">
                {lang === "he" ? m.nameHe : m.nameEn}
              </div>
              <div className="text-[10px] text-muted-foreground font-frank">
                {m.quantity}× @ {formatUSD(m.unitCostUSD)} {lang === "he" ? "ליחידה" : "each"}
              </div>
            </div>
            <div className="text-end">
              <div className="text-sm font-heebo font-bold text-foreground">
                {formatUSD(m.totalCostUSD)}
              </div>
              <div className="text-[9px] font-frank text-muted-foreground">
                {m.source}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default USMunitionsTreemap;
