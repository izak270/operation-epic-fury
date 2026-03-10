import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { getIranMissiles } from "@/data/arsenalData";

const MissileRangeRadar: React.FC = () => {
  const { lang } = useLanguage();
  const iranMissiles = getIranMissiles();

  const data = iranMissiles.map(m => ({
    name: lang === "he" ? m.nameHe : m.nameEn,
    range: m.rangeKm,
    warhead: m.warheadKg || 0,
    fullName: lang === "he" ? m.nameHe : m.nameEn,
  }));

  return (
    <div className="w-full h-[360px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(0,0%,18%)" />
          <PolarAngleAxis
            dataKey="name"
            stroke="hsl(0,0%,55%)"
            fontSize={10}
            tick={{ fill: "hsl(0,0%,70%)" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 2600]}
            stroke="hsl(0,0%,30%)"
            fontSize={9}
            tick={{ fill: "hsl(0,0%,45%)" }}
          />
          <Radar
            name={lang === "he" ? "טווח (ק\"מ)" : "Range (km)"}
            dataKey="range"
            stroke="hsl(90, 62%, 35%)"
            fill="hsl(90, 62%, 20%)"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Radar
            name={lang === "he" ? "ראש קרב (ק\"ג)" : "Warhead (kg)"}
            dataKey="warhead"
            stroke="hsl(0, 40%, 48%)"
            fill="hsl(0, 40%, 48%)"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Tooltip
            contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
            labelStyle={{ color: "hsl(0,0%,91%)" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MissileRangeRadar;
