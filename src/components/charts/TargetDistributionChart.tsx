import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { targetDistribution } from "@/data/targetDistribution";

const COLORS = [
  "hsl(213, 100%, 32%)",  // UAE
  "hsl(0, 0%, 63%)",      // Israel
  "hsl(40, 80%, 50%)",    // Kuwait
  "hsl(200, 60%, 40%)",   // Bahrain
  "hsl(280, 50%, 45%)",   // Qatar
  "hsl(30, 70%, 45%)",    // Iraq
  "hsl(90, 62%, 20%)",    // Saudi
];

const TargetDistributionChart: React.FC = () => {
  const { lang } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const data = targetDistribution.map(t => ({
    name: lang === "he" ? t.nameHe : t.nameEn,
    value: t.percent,
    projectiles: t.estimatedProjectiles,
    interceptRate: t.interceptRatePercent,
  }));

  const totalProjectiles = targetDistribution.reduce((s, t) => s + t.estimatedProjectiles, 0);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" fill="hsl(0,0%,91%)" fontSize={13} fontWeight={700}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="hsl(0,0%,55%)" fontSize={11}>
          {payload.value}% — {payload.projectiles.toLocaleString()}
        </text>
        <Sector
          cx={cx} cy={cy}
          innerRadius={innerRadius} outerRadius={outerRadius + 8}
          startAngle={startAngle} endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx} cy={cy}
          innerRadius={innerRadius - 4} outerRadius={innerRadius - 1}
          startAngle={startAngle} endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="w-full h-[320px] relative" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            dataKey="value"
            onMouseEnter={(_, idx) => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(undefined)}
            stroke="hsl(0,0%,7%)"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      {activeIndex === undefined && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-lg font-heebo font-black text-foreground">{totalProjectiles.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground font-frank">
              {lang === "he" ? "סה\"כ קליעים" : "Total Projectiles"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetDistributionChart;
