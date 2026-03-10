import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { dataVersions } from "@/data/militaryData";

const CasualtyBreakdownChart: React.FC = () => {
  const { lang } = useLanguage();
  const v1 = dataVersions[1];
  const milKia = v1.categories.find(c => c.id === "mil_kia")!;
  const civKilled = v1.categories.find(c => c.id === "civ_killed")!;

  // Iran casualties breakdown: military vs civilian
  const iranMil = Number(milKia.data.iran);  // 3000
  const iranCiv = Number(civKilled.data.iran); // 1332
  const total = iranMil + iranCiv;

  const data = [
    {
      name: lang === "he" ? "כוחות צבא ומשטר" : "Military & Regime Forces",
      value: iranMil,
      percent: ((iranMil / total) * 100).toFixed(1),
    },
    {
      name: lang === "he" ? "אזרחים" : "Civilians",
      value: iranCiv,
      percent: ((iranCiv / total) * 100).toFixed(1),
    },
  ];

  const COLORS = ["hsl(0, 0%, 40%)", "hsl(0, 40%, 48%)"];

  return (
    <div className="w-full h-[320px] relative" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            stroke="hsl(0,0%,7%)"
            strokeWidth={3}
            label={({ name, percent }) => `${name} (${percent}%)`}
            labelLine={{ stroke: "hsl(0,0%,40%)" }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
            formatter={(val: number) => val.toLocaleString()}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs text-muted-foreground font-frank">
          {lang === "he" ? `סה"כ: ${total.toLocaleString()} הרוגים באיראן` : `Total: ${total.toLocaleString()} killed in Iran`}
        </span>
      </div>
    </div>
  );
};

export default CasualtyBreakdownChart;
