import React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { usMunitionsSpending, totalUSSpending100Hours } from "@/data/costData";

const COLORS_OFFENSIVE = ["hsl(0, 40%, 48%)", "hsl(0, 40%, 38%)", "hsl(0, 40%, 58%)"];
const COLORS_DEFENSIVE = ["hsl(213, 100%, 32%)", "hsl(213, 80%, 42%)", "hsl(213, 80%, 25%)", "hsl(213, 60%, 50%)"];

const USMunitionsTreemap: React.FC = () => {
  const { lang } = useLanguage();

  const offensive = usMunitionsSpending.filter(m => m.type === "offensive");
  const defensive = usMunitionsSpending.filter(m => m.type === "defensive");

  const treeData = [
    {
      name: lang === "he" ? "חימוש התקפי" : "Offensive",
      children: offensive.map((m, i) => ({
        name: lang === "he" ? m.nameHe : m.nameEn,
        size: m.totalCostUSD,
        qty: m.quantity,
        unitCost: m.unitCostUSD,
        color: COLORS_OFFENSIVE[i % COLORS_OFFENSIVE.length],
      })),
    },
    {
      name: lang === "he" ? "מיירטים (הגנה)" : "Defensive (Interceptors)",
      children: defensive.map((m, i) => ({
        name: lang === "he" ? m.nameHe : m.nameEn,
        size: m.totalCostUSD,
        qty: m.quantity,
        unitCost: m.unitCostUSD,
        color: COLORS_DEFENSIVE[i % COLORS_DEFENSIVE.length],
      })),
    },
  ];

  const formatUSD = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(0)}M`;
    return `$${(val / 1_000).toFixed(0)}K`;
  };

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, color, size } = props;
    if (width < 40 || height < 30) return null;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={color || "hsl(0,0%,15%)"} stroke="hsl(0,0%,7%)" strokeWidth={2} rx={3} />
        {width > 60 && height > 40 && (
          <>
            <text x={x + 8} y={y + 18} fill="hsl(0,0%,91%)" fontSize={11} fontWeight={700}>
              {name}
            </text>
            <text x={x + 8} y={y + 34} fill="hsl(0,0%,70%)" fontSize={10}>
              {formatUSD(size || 0)}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className="w-full">
      <div className="text-center mb-2">
        <span className="text-sm font-heebo font-bold text-foreground">
          {formatUSD(totalUSSpending100Hours)}
        </span>
        <span className="text-xs text-muted-foreground font-frank ms-2">
          {lang === "he" ? "ב-100 שעות ראשונות" : "in first 100 hours"}
        </span>
      </div>
      <div className="h-[300px]" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treeData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="hsl(0,0%,7%)"
            content={<CustomContent />}
          >
            <Tooltip
              contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
              formatter={(val: number) => formatUSD(val)}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default USMunitionsTreemap;
