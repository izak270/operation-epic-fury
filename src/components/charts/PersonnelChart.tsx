import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { dataVersions } from "@/data/militaryData";

const COLORS = {
  active: "hsl(213, 100%, 32%)",
  reserve: "hsl(213, 100%, 52%)",
};

const PersonnelChart: React.FC = () => {
  const { t, lang } = useLanguage();
  const v1 = dataVersions[1];
  const active = v1.categories.find(c => c.id === "active")!;
  const reserve = v1.categories.find(c => c.id === "reserve")!;

  const data = [
    {
      name: t("country.usa"),
      active: Number(active.data.usa),
      reserve: Number(reserve.data.usa),
    },
    {
      name: t("country.israel"),
      active: Number(active.data.israel),
      reserve: Number(reserve.data.israel),
    },
    {
      name: t("country.iran"),
      active: Number(active.data.iran),
      reserve: Number(reserve.data.iran),
    },
  ];

  const formatNumber = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
    return val.toString();
  };

  return (
    <div className="w-full h-[300px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" tickFormatter={formatNumber} stroke="hsl(0,0%,55%)" fontSize={11} />
          <YAxis type="category" dataKey="name" stroke="hsl(0,0%,55%)" fontSize={12} width={60} />
          <Tooltip
            contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
            labelStyle={{ color: "hsl(0,0%,91%)" }}
            formatter={(val: number) => val.toLocaleString()}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "hsl(0,0%,91%)", fontSize: 11 }}>
                {value === "active" ? (lang === "he" ? "סדיר" : "Active") : (lang === "he" ? "מילואים" : "Reserve")}
              </span>
            )}
          />
          <Bar dataKey="active" stackId="a" fill={COLORS.active} radius={[0, 0, 0, 0]} />
          <Bar dataKey="reserve" stackId="a" fill={COLORS.reserve} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PersonnelChart;
