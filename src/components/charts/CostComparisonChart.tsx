import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { costComparisons } from "@/data/costData";

const CostComparisonChart: React.FC = () => {
  const { lang } = useLanguage();

  const data = costComparisons.map(c => ({
    name: lang === "he" ? c.attackNameHe.slice(0, 20) : c.attackNameEn.slice(0, 20),
    attack: c.attackCostUSD,
    defense: c.defenseCostUSD,
    attackLabel: lang === "he" ? c.attackNameHe : c.attackNameEn,
    defenseLabel: lang === "he" ? c.defenseNameHe : c.defenseNameEn,
    ratio: c.ratio,
  }));

  const formatUSD = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="w-full h-[340px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
          <XAxis dataKey="name" stroke="hsl(0,0%,55%)" fontSize={10} angle={-20} textAnchor="end" interval={0} />
          <YAxis
            stroke="hsl(0,0%,55%)"
            fontSize={11}
            scale="log"
            domain={[10000, 30000000]}
            tickFormatter={formatUSD}
            allowDataOverflow
          />
          <Tooltip
            contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
            labelStyle={{ color: "hsl(0,0%,91%)" }}
            formatter={(val: number, name: string) => [
              formatUSD(val),
              name === "attack"
                ? (lang === "he" ? "עלות תקיפה" : "Attack Cost")
                : (lang === "he" ? "עלות הגנה" : "Defense Cost")
            ]}
          />
          <Bar dataKey="attack" fill="hsl(0, 40%, 48%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="defense" fill="hsl(90, 62%, 20%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostComparisonChart;
